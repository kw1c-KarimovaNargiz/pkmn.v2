import React from 'react';

const CardOperations = ({ onSortByEvo, onRestoreOriginal }) => {
    return (
        <div className="card-operations">
            <button onClick={onSortByEvo}>Sort by Evolution</button>
            <button onClick={onRestoreOriginal}>Restore Original</button>
        </div>
    );
};

export default CardOperations;
