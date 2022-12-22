import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function UserEditor({ state, item, onSave, onClose }) {
    useEffect(() => {
        setForm(item);
    }, [item]);

    const [form, setForm] = useState(item);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(data => ({ ...data, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Modal show={state} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row mt-2">
                    <div className="mb-3">
                        <label className="labels">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="labels">Mobile Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="labels">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="labels">City</label>
                        <input
                            type="text"
                            name="city"
                            className="form-control"
                            value={form.city}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}
