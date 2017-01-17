class BlockSandboxForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  render () {
    return (
      <Form schema={this.props.schema} onSubmit={this.onSubmit} />
    );
  }

  onSubmit(event) {
    const data = { event: event.formData };
    $.post(this.props.submit_url, data, () => { location.reload(); });
  }
}

BlockSandboxForm.propTypes = {
  schema: React.PropTypes.object
};