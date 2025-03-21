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

def combine_shifts(shifts):
    combined = [shift for shift in shifts if shift.type == "Timecard"]
    schedule = [shift for shift in shifts if shift.type == "Schedule"]

    for scheduled_shift in schedule:
        if not any(timecard_shift.date == scheduled_shift.date for timecard_shift in combined):
            combined.append(scheduled_shift)

    return combined

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


@work.route("/shifts/week", methods=["GET"])
@login_required
def week_shifts():
    date = request.args.get("date")

    if not date:
        return jsonify({"error": "no date has been provided"}), 401

    date = datetime.strptime(date, "%Y-%m-%d")

    start = date - timedelta(days=date.weekday())
    end = start + timedelta(days=6)
    this_week = Shift.query.filter(
        Shift.user == current_user,
        Shift.date.between(start, end)
    )
    this_week = combine_shifts(this_week)
    this_week_total = sum([shift.hours for shift in this_week])
    this_week_pay = sum([shift.hours * shift.rate for shift in this_week])

    last_start = start - timedelta(weeks=1)
    last_end = last_start + timedelta(days=6)
    last_week = Shift.query.filter(
        Shift.user == current_user,
        Shift.date.between(last_start, last_end)
    )
    last_week = combine_shifts(last_week)
    last_week_pay = sum([shift.hours * shift.rate for shift in last_week])

    percent = ((this_week_pay - last_week_pay) / this_week_pay) * 100

    return jsonify({
        "pay": this_week_pay,
        "hours": this_week_total,
        "percent": percent,
    }), 200


@work.route("/shifts/month", methods=["GET"])
@login_required
def month_shifts():
    date = request.args.get("date")

    if not date:
        return jsonify({"error": "no date has been provided"}), 401

    date = datetime.strptime(date, "%Y-%m-%d")

    start = datetime(date.year, date.month, 1).date()
    end = start + relativedelta(months=1) - timedelta(days=1)
    this_month = Shift.query.filter(
        Shift.user == current_user,
        Shift.date.between(start, end)
    )
    this_month = combine_shifts(this_month)
    this_month_total = sum([shift.hours for shift in this_month])
    this_month_pay = sum([shift.hours * shift.rate for shift in this_month])

    last_start = start - relativedelta(months=1)
    last_end = end - relativedelta(months=1)
    last_month = Shift.query.filter(
        Shift.user == current_user,
        Shift.date.between(last_start, last_end)
    )
    last_month = combine_shifts(last_month)
    last_month_pay = sum([shift.hours * shift.rate for shift in last_month])

    percent = ((this_month_pay - last_month_pay) / this_month_pay) * 100

    return jsonify({
        "pay": this_month_pay,
        "hours": this_month_total,
        "percent": percent,
    }), 200


@work.route("/shifts/average/week", methods=["GET"])
@login_required
def average_weekly():
    end = datetime.today().date()
    new_shifts = Shift.query.order_by(Shift.date).filter(
        Shift.user == current_user,
        Shift.date < end
    ).all()
    old_shifts = Shift.query.order_by(Shift.date).filter(
        Shift.user == current_user,
        Shift.date < end - timedelta(days=end.weekday()) - timedelta(weeks=1)
    ).all()

    new_shifts = combine_shifts(new_shifts)
    old_shifts = combine_shifts(old_shifts)

    if not len(new_shifts) > 0:
        return

    start = new_shifts[0].date
    start = start - timedelta(days=start.weekday())
    end = end - timedelta(days=end.weekday())
    weeks = (end - start).days / 7

    new_pay = sum([shift.rate * shift.hours for shift in new_shifts]) / weeks
    new_hours = sum([shift.hours for shift in new_shifts]) / weeks
    old_pay = sum([shift.rate * shift.hours for shift in old_shifts]) / (weeks - 1)

    percent = ((new_pay - old_pay) / new_pay) * 100

    return jsonify({
        "pay": new_pay,
        "hours": new_hours,
        "percent": percent
    }), 200




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
