import React from 'react';
import { in$ } from 'moneysafe';
import useLineItemRowHook from './useLineItemRowHook';
import './LineItemRow.css';

/**
 * A single row in the Line Items Table.
 */
function LineItemRow(props) {
  const { saveLineItem, item: parentItem } = props;
  const {
    item,
    details,
    quantity,
    price,
    itemTotal,
    in_stock,
    is_taxable,
  } = parentItem;

  // Format strings
  const unitPrice = `$${price.toFixed(2)}`;
  // Transform moneysafe calculation from cents into dollars for display.
  const total = `$${in$(itemTotal).toFixed(2)}`;

  const [{ status, inputValue }, dispatch, inputRef] = useLineItemRowHook();

  return (
    <tr className="line-item-row">
      <th scope="row">{item}</th>
      <td>{details}</td>
      <td className="editable">
        {status === 'reading' && (
          <span onClick={() => dispatch({ type: 'EDIT', value: quantity })}>
            {quantity}
          </span>
        )}
        {status === 'editing' && (
          <input
            ref={inputRef}
            type="number"
            step={1}
            min={0}
            max={in_stock}
            value={inputValue}
            onBlur={() => {
              dispatch({ type: 'BLUR' });
              saveLineItem({
                ...parentItem,
                quantity: Number.parseFloat(inputValue),
              });
            }}
            onChange={e => dispatch({ type: 'CHANGE', value: e.target.value })}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                dispatch({ type: 'COMMIT' });
                saveLineItem({
                  ...parentItem,
                  quantity: Number.parseFloat(inputValue),
                });
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                dispatch({ type: 'CANCEL' });
              }
            }}
          />
        )}
      </td>
      <td>{unitPrice}</td>
      <td>{is_taxable && <>&#10003;</>}</td>
      <td>{total}</td>
    </tr>
  );
}
export default LineItemRow;
