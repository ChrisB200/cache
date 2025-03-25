import pytest
from unittest.mock import AsyncMock, MagicMock
from src.scripts.payslips import get_rate  # Ensure this is your actual function

@pytest.mark.asyncio
async def test_get_rate():
    # Mock the page object
    mock_page = AsyncMock()

    # Mock the locator method to return another MagicMock (not async)
    mock_locator = MagicMock()
    mock_page.locator.return_value = mock_locator  # `locator()` is not async in Playwright

    # Mock the all() method of the locator (this is async)
    mock_element_1 = AsyncMock()
    mock_element_2 = AsyncMock()
    mock_element_3 = AsyncMock()

    # Mock inner_text() return values (these are async methods)
    mock_element_1.inner_text = AsyncMock(return_value="£15.50")
    mock_element_2.inner_text = AsyncMock(return_value="£20.00")
    mock_element_3.inner_text = AsyncMock(return_value="No rate here")

    # Set up all() to return a list of elements
    mock_locator.all = AsyncMock(return_value=[mock_element_1, mock_element_2, mock_element_3])

    # Run the function
    result = await get_rate(mock_page)

    # Assertions
    assert result == 15.50  # Expecting the first valid rate
    mock_page.locator.assert_called_once_with(".TDData")
    mock_locator.all.assert_awaited_once()
    mock_element_1.inner_text.assert_awaited_once()
    mock_element_2.inner_text.assert_awaited_once()
    mock_element_3.inner_text.assert_awaited_once()

