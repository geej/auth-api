module.exports = (children, { title }) => `
  <!doctype html>
  <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-pink.min.css" />
        <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
        <style>
          .register-card {
            margin: auto;
            margin-top: 50px;
          }
      
          .register-card .mdl-card__title {
            background: #888;
          }
        </style>
    </head>
    <body>
      ${children}
    </body>
  </html>
`;