import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function UserLine({ item, onEdit, onDelete }) {
    return (
        <tr>
            <th>
                <div className="user-avatar">
                    {item.name.substring(0, 1).toUpperCase()}
                </div>
            </th>
            <td>
                <h4>{item.name}</h4>
                <h5 className="text-muted">{item.city}</h5>
            </td>
            <td>
                <h5>{item.phone}</h5>
                <h5>{item.email}</h5>
            </td>
            <td className="align-right">
                <ButtonGroup aria-label="Basic example">
                    <Button variant="warning" onClick={() => onEdit(item)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(item)}>Delete</Button>
                </ButtonGroup>
            </td>
        </tr>
    );
}
