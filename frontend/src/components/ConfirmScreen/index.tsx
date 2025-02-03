interface ConfirmScreenProps{
    onConfirm: () => void, 
    onClose: () => void, 
    message?: string
}

const ConfirmScreen = ({onConfirm, onClose, message}: ConfirmScreenProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Confirmação</h2>
            <p className="mt-2">{message || "Você tem certeza que deseja continuar?"}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Confirmar</button>
            </div>
          </div>
        </div>
      );
}

export default ConfirmScreen;