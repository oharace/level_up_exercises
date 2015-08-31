Given(/^I am on the bomb page$/) do
  visit '/'
  sleep(0.5)
end

Given(/^the bomb is deactivated$/) do
  expect(page).to have_content("Deactivated")
end

When(/^I enter the correct activation code$/) do
  fill_in('formInput', with: '1234')
  click_button('Submit')
end

Then(/^the bomb should be activated$/) do
  expect(page).to have_content("Activated")
end

Then(/^the timer should start$/) do
  expect(page).to have_selector('#timer', visible: true)
end

Given(/^the bomb is activated$/) do
  fill_in('formInput', with: '1234')
  click_button('Submit')
  sleep(0.5)
  expect(page).to have_content("Activated")
end

When(/^I enter the correct deactivation code$/) do
  fill_in('code', with: '0000')
  click_button('Submit')
end

Then(/^the bomb should be deactivated$/) do
  expect(page).to have_content("Deactivated")
end

Then(/^the timer should be stopped$/) do
  expect(page).to have_selector('#timer', visible: false)
end

When(/^I enter an activation code$/) do
  fill_in('code', with: '1234')
  click_button('Submit')
end

Then(/^nothing happens$/) do
  sleep(0.3)
  expect(page).to have_content("Activated")
  expect(page).not_to have_content("02:00")
end

When(/^I enter an incorrect activation code$/) do
  fill_in('code', with: '1111')
  click_button('Submit')
  sleep(0.3)
  expect(page).to have_content("Invalid!")
end

When(/^I enter an incorrect deactivation code$/) do
  fill_in('code', with: '1111')
  click_button('Submit')
  sleep(0.3)
  expect(page).to have_content("(2 attempts remaining!)")
end

When(/^I enter an incorrect deactivation code three times$/) do
  fill_in('code', with: '1111')
  click_button('Submit')
  sleep(0.3)
  expect(page).to have_content("(2 attempts remaining!)")
  fill_in('code', with: '1111')
  click_button('Submit')
  sleep(0.3)
  expect(page).to have_content("(1 attempt remaining!")
  fill_in('code', with: '1111')
  click_button('Submit')
  sleep(0.3)
end

Then(/^the bomb should explode$/) do
  expect(page).to have_content("!@#$%^&*!@#&$!")
end

Then(/^the buttons should be disabled$/) do
  expect(page).to have_button("formButton", disabled: true)
end

When(/^the bomb timer ends$/) do
  sleep(120.1)
end

Given(/^the bomb is not exploded$/) do
  expect(page).to have_content("Deactivated")
end

When(/^I enter an invalid code$/) do
  fill_in('code', with: 'a')
  click_button('Submit')
  sleep(0.3)
end

Then(/^I should see that only numerical inputs are allowed$/) do
  page.has_content?("Only numeric input is allowed.")
end
