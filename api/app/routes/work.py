from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Shift, Payslip
from sqlalchemy import desc
from datetime import timedelta, datetime
from dateutil.relativedelta import relativedelta
from itertools import combinations
from ics import Calendar, Event

work = Blueprint("work", __name__)
current_user: User


def time_difference(time1, time2):
    dummy_date = datetime(1900, 1, 1)
    dt1 = datetime.combine(dummy_date, time1)
    dt2 = datetime.combine(dummy_date, time2)
    time_diff = dt2 - dt1
    hours = time_diff.total_seconds() / 3600
    return hours

@work.route("/payslips", methods=["GET"])
@login_required
def payslips():
    month = request.args.get("month")
    year = request.args.get("year")

    if month:
        year = datetime.now().year if year is None else int(year)
        month = int(month) + 1
        start_date = datetime(year, month, 1)
        end_date = start_date + relativedelta(months=1)

        payslips = Payslip.query.filter(
            Payslip.date.between(start_date, end_date),
            Payslip.user == current_user
        )
    else:
        payslips = Payslip.query.filter_by(user=current_user).all()

    return jsonify([payslip.to_json() for payslip in payslips])


@work.route("/shifts", methods=["GET"])
@login_required
def shifts():
    month = request.args.get("month")
    year = request.args.get("year")

    if month:
        year = datetime.now().year if year is None else int(year)
        month = int(month) + 1
        start_date = datetime(year, month, 1)
        end_date = start_date + relativedelta(months=1)

        shifts = Shift.query.filter(
            Shift.date.between(start_date, end_date),
            Shift.user == current_user,
        )
    else:
        shifts = Shift.query.filter_by(user=current_user).all()

    return jsonify([shift.to_json() for shift in shifts])


@work.route("/shifts/next")
def next_shift():
    today = datetime.now()
    shift = Shift.query.order_by(Shift.date).filter(
        Shift.date >= today.date(),
        Shift.start >= today.time(),
        Shift.type == "Schedule",
        Shift.user == current_user
    ).first()

    return jsonify(shift.to_json()), 200



@work.route("/payslips/<int:payslip_id>/shifts", methods=["GET"])
@login_required
def shifts_by_payslip(payslip_id):
    payslip = Payslip.query.filter_by(user_id=current_user.id, id=payslip_id).first()
    payslip = current_user.payslips[payslip_id]

    if payslip:
        return jsonify([shift.to_json() if shift.type == "Timecard" else None for shift in payslip.shifts])
    else:
        return jsonify("Can't find the payslip"), 404


@work.route("/payslips/forecast", methods=["GET"])
@login_required
def forecasted_payslip():
    payslips = sorted(current_user.payslips, key=lambda x: x.date, reverse=True)
    if len(payslips) == 0:
        return jsonify({
            "date": None,
            "hours": 0,
            "rate": 11.65,
            "shifts": []
        })

    recent_payslip = payslips[0]
    start_date = recent_payslip.date - timedelta(days=2)
    end_date = start_date + timedelta(weeks=2)

    shifts = Shift.query.filter(
        Shift.date.between(start_date, end_date),
        Shift.user == current_user
    )

    payslip = {
        "date": end_date + timedelta(days=2),
        "hours": 0,
        "rate": recent_payslip.rate,
        "shifts": []
    }

    timecard = [shift for shift in shifts if shift.type == "Timecard"]
    schedule = [shift for shift in shifts if shift.type == "Schedule"]
    combined = timecard.copy()

    for shift in schedule:
        if shift.date not in [tshift.date for tshift in timecard]:
            combined.append(shift)

    payslip["hours"] = sum([shift.hours for shift in combined])
    payslip["shifts"] = [shift.to_json() for shift in combined]

    return jsonify(payslip)


@work.route("/shifts/<int:shift_id>", methods=["PUT"])
@login_required
def edit_shift(shift_id):
    start_str = request.json.get("start")
    end_str = request.json.get("end")

    start = datetime.strptime(start_str, "%H:%M").time()
    end = datetime.strptime(end_str, "%H:%M").time()

    if start > end:
        return jsonify({"error": "Start time is after end time"}), 422

    shift = Shift.query.filter_by(id=shift_id).one()

    if shift is None:
        return jsonify({"error": "Cannot find shift with that ID"}), 410

    shift.start = start
    shift.end = end
    shift.hours = time_difference(start, end)
    shift.has_scraped = 0

    db.session.add(shift)
    db.session.commit()

    return jsonify({"message": "Successfully updated shift"}), 200


@work.route("/create_ics", methods=["POST"])
@login_required
def create_ics():
    shifts = Shift.query.filter_by(user_id=current_user.id).all()

    calendar = Calendar()
    for shift in shifts:
        event = Event()
        event.name = "Work"
        event.begin = shift.start
        event.duration = {"hours": shift.hours}
        event.location = "Five Guys Fort"
        event.description = f"{shift.category}: {shift.hours}: {shift.hours * shift.rate}"

        calendar.events.add(event)

    with open(f"calendars/{current_user.id}-work.ics", "w") as f:
        f.writelines(calendar)

    return jsonify({"message": "success"})
