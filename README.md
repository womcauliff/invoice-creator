# Invoice Creator

This is a client-side application to create invoices.

## Layout of the User Interface

### Adding Line Items

Each line item of the invoice is displayed within a table. Of course, this table will initially be empty, but clicking the "Add Line Item(s)" button will open a modal which allows the user to select which line items should be added.

This application retrieves all available line items from the backend API. From these available line items, the user may select which line items they will charge their customer.

Immediately beneath the line items table is a second table in which the subtotal, tax, and total are calculated automatically according to the quantities and unit prices of the line items above.

The user may change the quantity for a selected line item in the table by clicking on the table cell and typing in the new quantity value (the application validates user input, ignoring any updates to quantity that are negative numbers, or not a number at all).

### Submitting Invoices

On page load, the line item table will be empty. To prevent the submission of invoice with no selected line items, the button to submit the invoice to the API is disabled. After one or more line items have been selected, the button is enabled.

Once the submit button is clicked, the button's text changes to "Submitting Invoice... ", and it remains disabled while the `POST` request to the API is in-flight.

If the `POST` request is successful, the line item table data is cleared so that the interface is ready for the user to begin creating a new invoice. However, if the API request fails, the table data is left as is, so that the user may attempt to re-submit the invoice.

## Technologies

### Money Calculations

JavaScript will produce rounding errors when performing math operations using floating-point numbers (IEEE 754 64-bit floating point numbers, to be precise). This is problematic, _particularly when the values involved in the application represent currency or billing_. In these cases, rounding errors result in an application over- or undercharging a company's clients.

As such, this application relies on a utility library, `moneysafe`, to ensure the monetary values calculated are accurate.

### React

This application is built using React, a library for building user interfaces. In addition, the sourcecode for this application makes use of Hooks, a new feature of React.

`useReducer` hooks are used to organize the logic for changes to application state, and `useEffect` is employed to retrieve API data and perform DOM manipulation.

---

### Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

##### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

##### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

##### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

##### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

##### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

##### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
