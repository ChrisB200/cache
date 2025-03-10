import logging
import logging.handlers as handlers
import asyncio

from playwright.async_api import async_playwright
from playwright._impl._errors import TargetClosedError

from scripts.parser import parser
from scripts.scraper import get_user, get_users
from scripts.shifts import get_shifts
from scripts.payslips import get_payslips



logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


async def scrape_user(user, playwright, headless, command):
    browser = await playwright.firefox.launch(headless=headless)
    logger.debug(f"Browser opened for user {user["id"]}")

    try:
        if command == "all":
            await get_payslips(browser, user)
            await get_shifts(browser, user)
        if command == "shifts":
            await get_shifts(browser, user)
        if command == "payslips":
            await get_payslips(browser, user)
        logger.info(f"Finished scraping {command} for user {user["id"]}")
    except TargetClosedError as e:
        logger.error(e)
    except:
        logger.error("error")
    finally:
        await browser.close()
        logger.debug(f"Browser closed for user {user["id"]}")


async def scrape_all(playwright, headless, command):
    users = get_users()
    tasks = [scrape_user(user, playwright, headless, command) for user in users]
    await asyncio.gather(*tasks)


async def main(action, user, all_users, headless=True):
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
    args = parser.parse_args()

    if not args.action:
        raise TypeError("Need to pass what you want to scrape (shifts, payslips, all)")

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
    else:
        logging.getLogger().setLevel(logging.INFO)

    if args.file:
        logging.getLogger().addHandler(handlers.RotatingFileHandler(args.file, maxBytes=20*1024*1024, backupCount=3))


    asyncio.run(main(args.action, args.user_id, args.all_users, args.headless))
