import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(cookieParser());

const csrfProtection = csurf({
  cookie: {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'

  }
});

const attachCsrfToken = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
  });
  next();
};

export { csrfProtection, attachCsrfToken };
