const StateChangesModal = ({ show, onClose, changes }) => {
    if (!show) return null;

    return (
        <div className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">State Changes</h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ul>
                            {changes.map((change, index) => (
                                <li key={index}>
                                    {`Estado: ${change.estado}, Usuario: ${change.usuarioCambioEstado}, Fecha: ${change.fecha}, Hora: ${change.hora}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StateChangesModal