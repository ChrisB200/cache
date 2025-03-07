import argparse

# Argument parser setup
parser = argparse.ArgumentParser(
    description="Worker for the users within the Cache program"
)
parser.add_argument("-head", "--headless", help="run browser headless", action="store_true")
parser.add_argument("-f", "--file", help="log file location")
parser.add_argument("-d", "--debug", help="set debug state", action="store_true")

subparsers = parser.add_subparsers(
    title="subcommands", description="valid subcommands", dest="action"
)

# Subparser for shifts
shift_parser = subparsers.add_parser("shifts", help="Scrapes shifts")
shift_parser.add_argument(
    "-u", "--user_id", help="The user_id to scrape the shifts for"
)
shift_parser.add_argument(
    "-a", "--all_users", help="Scrapes shifts for all users", action="store_true"
)

# Subparser for payslips
payslip_parser = subparsers.add_parser("payslips", help="Scrapes payslips")
payslip_parser.add_argument(
    "-u", "--user_id", help="The user_id to scrape the payslips for"
)
payslip_parser.add_argument(
    "-a",
    "--all_users",
    help="Scrapes payslips for all users",
    action="store_true",
)

# Subparser for both shifts and payslips
all_parser = subparsers.add_parser("all", help="Scrape both shifts and payslips")
all_parser.add_argument(
    "-u", "--user_id", help="The user ID to scrape shifts and payslips for"
)
all_parser.add_argument(
    "-a",
    "--all_users",
    help="Scrape shifts and payslips for all users",
    action="store_true",
)
