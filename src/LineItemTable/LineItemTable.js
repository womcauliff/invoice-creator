import React from 'react';
import { Table } from 'reactstrap';
import LineItemRow from '../LineItemRow';

/**
 * The table of invoice line items.
 * Displays message when no invoice line items have been selected.
 */
function LineItemTable(props) {
  const { saveLineItem, selectedLineItems } = props;
  return (
    <Table hover bordered responsive="sm" className="line-item-table mb-0">
      <thead className="thead-light">
        <tr>
          <th>Item</th>
          <th>Details</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Taxed</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {selectedLineItems.map(item => (
          <LineItemRow key={item.id} item={item} saveLineItem={saveLineItem} />
        ))}
        {selectedLineItems.length === 0 && (
          <tr>
            <td>No line items specified.</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default LineItemTable;
