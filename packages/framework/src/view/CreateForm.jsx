import { h } from 'preact';

module.exports = ({ url, model, csrfToken }) => {
  return (
    <form action={url} method="post">
      <div className="register-card mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">Create {model.schema.title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          {
            Object.keys(model.schema.properties).map((key) => {
              const { title } = model.schema.properties[key];

              if (!title) {
                return null;
              }

              return (
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input className="mdl-textfield__input" type="text" id={key} name={key} />
                  <label className="mdl-textfield__label" for={key}>{title}</label>
                </div>
              );
            })
          }
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <input className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" type="submit" value="Submit" />
        </div>
      </div>
    </form>
  );
};