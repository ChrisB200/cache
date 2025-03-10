import pytest
from unittest.mock import AsyncMock
from src.scripts.payslips import get_rate


@pytest.mark.asyncio
async def test_get_rate(mocker):
    # Mock the page object and locator
    mock_page = AsyncMock()
    mock_locator = AsyncMock()
    
    # Mock the locator's all method to return a list of mock elements
    mock_element_1 = AsyncMock()
    mock_element_2 = AsyncMock()
    mock_element_3 = AsyncMock()
    mock_locator.all.return_value = [mock_element_1, mock_element_2, mock_element_3]

    # Mock the inner text of each element
    mock_element_1.inner_text.return_value = "£15.50"
    mock_element_2.inner_text.return_value = "£20.00"
    mock_element_3.inner_text.return_value = "No rate here"

    # Mock page.locator to return the mock locator
    mock_page.locator.return_value = mock_locator

    # Run the function
    result = await get_rate(mock_page)

    # Assertions
    assert result == 15.50  # Expecting the first valid rate
    mock_page.locator.assert_called_once_with(".TDData")
    mock_element_1.inner_text.assert_awaited_once()
    mock_element_2.inner_text.assert_awaited_once()
    mock_element_3.inner_text.assert_awaited_once()
