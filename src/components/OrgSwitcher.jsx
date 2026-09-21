import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function OrgSwitcher() {
  const { orgs, org, setOrg } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function choose(name) {
    setOpen(false);
    if (name !== org) {
      setOrg(name);
      toast('Switched to ' + name);
    }
  }

  return (
    <div className="orgsw" ref={ref}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Organization: ${org}. Switch organization`} onClick={() => setOpen(v => !v)}>
        <span>{org}</span>
        <Icon name="chevron" size={18} />
      </button>
      <ul role="menu" hidden={!open}>
        {orgs.map(o => (
          <li role="none" key={o}>
            <button role="menuitemradio" aria-checked={o === org} onClick={() => choose(o)}>
              <span>{o}</span>
              {o === org && <Icon name="check" size={18} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
