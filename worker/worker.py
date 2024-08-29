import logging
import asyncio

from playwright.async_api import async_playwright

from scripts.parser import parser

from scripts.scraper import get_user
from scripts.scraper import scrape_user
from scripts.scraper import scrape_all

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        # logging.FileHandler("game.log")
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


def handle_args(args):
    action = args.action

    if not args.action:
        user = None
        all_users = None
    else:
        user = args.user_id
        all_users = args.all_users

    return action, user, all_users


async def main(headless=True):
    args = parser.parse_args()
    action, user, all_users = handle_args(args)

    async with async_playwright() as p:
        if all_users:
            logger.info(f"Scraping {action} for all users")
            await scrape_all(p, headless, action)
        elif user:
            logger.info(f"Scraping {action} for user {user}")
            await scrape_user(get_user(user), p, headless, action)
        else:
            logger.error("No valid user specified. Use -u or -a.")


if __name__ == "__main__":
    asyncio.run(main(False))
