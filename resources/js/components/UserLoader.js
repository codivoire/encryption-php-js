import React from 'react';

export default function UserLoader({show, message}) {
    return (
        <div className={`loader-container ${show ? 'open' : ''}`}>
            <div className="loader-dialog">
                <div className="text">{message ?? 'Chargement...'}</div>
            </div>
        </div>
    );
}
