import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { FormField } from './FormField.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const AddAppDialog = forwardRef(function AddAppDialog(_, ref) {
  const dialogRef = useRef(null);
  const { addApp } = useApp();
  const toast = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('Web app');
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    open() {
      setName(''); setType('Web app'); setError('');
      dialogRef.current?.showModal();
    }
  }));

  function submit(e) {
    e.preventDefault();
    // TODO(backend): POST /applications.
    if (!name) { setError('Enter the application’s name.'); return; }
    addApp({ name, type });
    dialogRef.current?.close();
    toast('Application added');
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dlg-title"
      onClick={e => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
    >
      <form className="dlg__in" noValidate onSubmit={submit}>
        <h2 id="dlg-title">Add application</h2>
        <FormField id="aname" label="Application name" placeholder="e.g. Customer Portal" value={name} onChange={e => setName(e.target.value)} error={error} />
        <div className="field">
          <label htmlFor="atype">Application type</label>
          <select id="atype" value={type} onChange={e => setType(e.target.value)}>
            <option>Web app</option>
            <option>Mobile app</option>
            <option>API</option>
            <option>Desktop app</option>
          </select>
        </div>
        <div className="actions row">
          <button type="button" className="btn btn--ghost" onClick={() => dialogRef.current?.close()}>Cancel</button>
          <button className="btn" type="submit">Add application</button>
        </div>
      </form>
    </dialog>
  );
});

export default AddAppDialog;
