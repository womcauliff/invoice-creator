# Invoice Creator

This is a client-side application to create invoices.

## Running the Application

This application has been bootstrapped with [`create-react-app`](https://facebook.github.io/create-react-app/), so thus Node 8.10.0 or later is required on a local development machine to run this application.

In the project directory, you can run: `npm start`

This command runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Layout of the User Interface

### Adding and Removing Line Items

Each line item of the invoice is displayed within a table. Of course, this table will initially be empty, but clicking the "Add Line Item(s)" button will open a modal which allows the user to select which line items should be added.

This application retrieves all available line items from the backend API. From these available line items, the user may select which line items they will charge their customer.

Because the line items are retrieved from the backend API, the table data may _not_ be edited by the user, except for the **quantity** values. The user may change the quantity for a selected line item in the table by clicking on the table cell and typing in the new quantity value (the application validates user input, ignoring any updates to quantity that are negative numbers, or not a number at all).

Adding more or removing line items can be done from the same modal as before. Unchecking a line item in the modal and saving the changes will remove it from the invoice's table.

### Auto-Calculation of Invoice Totals

Immediately beneath the line items table is a second table in which the **subtotal**, **tax**, and **total** are calculated automatically according to the quantities and unit prices of the line items above.

The application does take into account the fact that some items should not have sales tax applied to them (indicated by the `is_taxable` field from the API). Depending on the state, professional services like accounting or legal services may not be subject to sales taxes. Thus, in this application, non-taxable items are included in the **subtotal** value, but _not_ included in the calculation of the invoice's **tax** value.

See the section below on [money calculations](#money-calculations) for a description of how the totals were generated.

### Submitting Invoices

On page load, the line item table will be empty. To prevent the submission of an invoice with no selected line items, the button to submit the invoice to the API is disabled. After one or more line items have been selected, the button is enabled.

Once the submit button is clicked, the button's text changes to "Submitting Invoice... ", and it remains disabled while the `POST` request to the API is in-flight.

If the `POST` request is successful, the line item table data is cleared so that the interface is ready for the user to begin creating a new invoice. However, if the API request fails, the table data is left as is, so that the user may attempt to re-submit the invoice.

In both cases, a toast message appears in the top-right of the screen to notify the user whether the invoice was successfully created or not. For accessbility, the toast messages have been wrapped with appropriate `aria` labels.

### Assumptions and Further Development

I have opted not to implement the bonus feature of allowing the user to choose a customer from a customer list delivered by the API's `customer` resource. However, the API documentation lists `invoice.customer_id` as a required field, so for this application, I have hardcoded one of the customer IDs so that invoices can be generated successfully.

I have hardcoded a sales tax of 7% for this application. This could be modified in a future design to accept user input.

For further development, the application could be modified to support freeform line items, without having to first create them in the backend API. This expansion of control to the user should coincide with development of features like user input validation and error messages, since there will be more ways that the data can be modified to put the application into an error state.

## Technologies

### Money Calculations

JavaScript will produce rounding errors when performing math operations using floating-point numbers (IEEE 754 64-bit floating point numbers, to be precise). This is problematic, _particularly when the values involved in the application represent currency or billing_. In these cases, rounding errors result in an application over- or undercharging a company's clients.

As such, this application relies on a utility library, `moneysafe`, to ensure the monetary values calculated are accurate.

### React

This application is built using React, a library for building user interfaces. In particular, this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In addition, the sourcecode for this application makes use of Hooks, a new feature of React.

`useReducer` hooks are used to organize the logic for changes to application state, and `useEffect` is employed to retrieve API data and perform DOM manipulation.

### Bootstrap

This application relies on Bootstrap (v4), an opensource CSS library.
