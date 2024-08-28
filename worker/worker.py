import logging

from playwright.sync_api import sync_playwright

from scripts.parser import parser

from scripts.scraper import get_user
from scripts.scraper import scrape_user
from scripts.scraper import scrape_all

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # logging.FileHandler("game.log")
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def handle_args(args):
    action = args.action
    user = args.user_id
    all_users = args.all_users
    return action, user, all_users


def main(headless=True):
    args = parser.parse_args()
    action, user, all_users = handle_args(args)

    with sync_playwright() as p:
        if all_users:
            logger.info(f"Scraping {action} for all users")
            scrape_all(p, headless, action)
        elif user:
            logger.info(f"Scraping {action} for user {user}")
            scrape_user(get_user(user), p, headless, action)
        else:
            print("No valid user specified. Use -u or -a.")


if __name__ == "__main__":
    main(False)
