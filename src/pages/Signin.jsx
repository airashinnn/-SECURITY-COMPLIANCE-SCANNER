import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { FormField, PasswordField } from '../components/FormField.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { EMAIL, focusFirstInvalid, nameFromEmail } from '../utils.js';

export default function Signin() {
  const { setUser } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    // TODO(backend): POST /auth/login with email + password, then set the real session.
    const nextErrors = {
      email: EMAIL.test(email) ? '' : 'Enter a valid email address, like name@company.com.',
      pw: password ? '' : 'Enter your password.'
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return setTimeout(focusFirstInvalid);
    setUser({ name: nameFromEmail(email), email, role: 'Owner' });
    navigate('/app/overview');
  }

  return (
    <main className="auth">
      <Link className="corner" to="/" aria-label="Security Compliance System home"><Logo /></Link>
      <section className="auth__col">
        <div className="panel panel--center">
          <h1 id="page-title" tabIndex={-1}>Welcome Back!</h1>
          <p className="sub">Sign in to continue to your account</p>
          <form className="narrow" noValidate onSubmit={handleSubmit}>
            <FormField id="email" label="Email Address" type="email" placeholder="Enter your email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
            <PasswordField id="pw" label="Password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} error={errors.pw} />
            <div className="row-between">
              <label className="check"><input type="checkbox" name="remember" /> Remember me</label>
              <button type="button" className="link" onClick={() => toast('Password reset isn’t connected in this prototype.')}>Forgot password?</button>
            </div>
            <button className="btn btn--block" type="submit" style={{ minHeight: 57 }}>Sign in</button>
            <p className="alt" style={{ marginTop: 32 }}>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
          </form>
        </div>
      </section>
    </main>
  );
}
