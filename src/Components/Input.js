import React, { Component } from 'react'
import { withFormsy } from 'formsy-react'
import TextField from '@material-ui/core/TextField'

class Input extends Component {
  changeValue (e) {
    this.props.setValue(e.target.value)
  }

  render () {
    const { required, autoComplete, name, label, variant, size, type } = this.props
    return (
      <TextField
        required={required}
        autoComplete={autoComplete}
        name={name}
        label={label}
        variant={variant}
        size={size}
        type={type}
        onChange={(e) => this.changeValue(e)}
        value={this.props.getValue() || ''}
      />
    )
  }
}

export default withFormsy(Input)
