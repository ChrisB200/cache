from playwright.async_api import async_playwright
from playwright.async_api import Browser
from psycopg2.extensions import cursor
from .config.database import get_users, connect_to_database
from .sites.fgp import run_shift_scraper
import logging


logger = logging.getLogger(__name__)


async def scrape_user(browser: Browser, site, user_id, cur: cursor):
    match site:
        case "shifts":
            pass
        case "payslips":
            pass


async def scrape_all_users(browser: Browser, site, cur: cursor):
    users = get_users(cur)
    match site:
        case "shifts":
            for user in users:
                await run_shift_scraper(browser, cur, user)
        case "payslips":
            pass


async def run(site, user_id, all_users, headless=True):
    conn, cur = connect_to_database()
    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        logger.debug("Opened browser")

        if all_users:
            await scrape_all_users(browser, site, cur)
        else:
            await scrape_user(browser, site, user_id, cur)
