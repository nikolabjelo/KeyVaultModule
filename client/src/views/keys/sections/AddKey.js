import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { addKeyMutation, getKeysQuery, getBotsQuery } from '../../../queries'

//Material-ui
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { types, exchanges} from '../../../queries/models'

import {
   MenuItem, Button, IconButton, InputAdornment, TextField,
   FormControl, InputLabel, Input
} from '@material-ui/core'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    height: '100%'
  },
  textField: {
    width: '60%',
    marginLeft:'20%',
    marginBottom: 10
  },
  menu: {
    width: 200,
  },
  button: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
  },
  actionButton: {
    textAlign: 'center',
    marginTop: 10
  },

});

class AddKey extends Component {

  constructor(props){
    super(props)
    this.state = {
      key:'',
      secret:'',
      exchange:'',
      type:'',
      description:'',
      validFrom: '',
      validTo: '',
      active: true,
      botId:'',
      showPassword : false, //for showing the secret
      keyError: false,
      secretError: false,
      exchangeError: false,
      botIdError: false
    }
  }

  componentDidMount(){
    this.state.type = 'Competition'
    this.state.exchange = '1'
  }

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Button variant="outlined" size="small" fullWidth className={classes.actionButton}
          href="https://advancedalgos.net/documentation-poloniex-api-key.shtml">
          More details
        </Button>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>
            <TextField
              id="key"
              label="Key"
              className={classes.textField}
              value={this.state.key}
              onChange={(e)=>this.setState({key:e.target.value})}
              onBlur={(e)=>this.setState({keyError:false})}
              error={this.state.keyError}
              fullWidth
            />

          <FormControl className={classNames(classes.margin, classes.textField)}>
            <InputLabel htmlFor="secret">Secret</InputLabel>
            <Input
              id="secret"
              type={this.state.showPassword ? 'text' : 'password'}
              label="Secret"
              value={this.state.secret}
              onChange={(e)=>this.setState({secret:e.target.value})}
              onBlur={(e)=>this.setState({secretError:false})}
              error={this.state.secretError}
              fullWidth
              endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
            />
          </FormControl>

          <TextField
             select
             label="Exchange"
             className={classNames(classes.margin, classes.textField)}
             value={this.state.exchange}
             onChange={(e)=> this.setState({exchange:e.target.value})}
             onBlur={(e)=>this.setState({exchangeError:false})}
             error={this.state.exchangeError}
             fullWidth
             >
               {exchanges.map(option => (
                 <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
               ))}
          </TextField>

          <TextField
             select
             label="Type"
             className={classNames(classes.margin, classes.textField)}
             value={this.state.type}
             onChange={(e)=>this.setState({type:e.target.value})}
             fullWidth
             >
             {types.map(option => (
               <MenuItem key={option} value={option}>
                 {option}
               </MenuItem>
             ))}
           </TextField>

           <TextField
             id="description"
             label="Description"
             className={classes.textField}
             value={this.state.description}
             onChange={(e)=>this.setState({description:e.target.value})}
             fullWidth
           />

            {/* <TextField
                id="validFrom"
                label="Valid From"
                type="datetime-local"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e)=>this.setState({validFrom:e.target.value})}
                fullWidth
              />

            <TextField
              id="validTo"
              label="Valid To"
              type="datetime-local"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>this.setState({validTo:e.target.value})}
              fullWidth
            /> */}

            <TextField
               select
               label="Bot"
               className={classNames(classes.margin, classes.textField)}
               value={this.state.botId}
               onChange={(e)=>this.setState({botId:e.target.value})}
               onBlur={(e)=>this.setState({botIdError:false})}
               error={this.state.botIdError}
               fullWidth
               >
                 { this.displayBots() }
             </TextField>

             <br />

             <div className={classes.actionButton} >
               <Button
                 type="submit"
                 variant="outlined" color="primary">
                 Add Key
               </Button>
             </div>

        </form>
      </React.Fragment>
    );
  }

    displayBots(){
      if(!this.props.getBotsQuery.loading){
        let bots = this.props.getBotsQuery.teams_FbByTeamMember.fb
        if (bots.length > 0){
          return bots.map(bot => (
            <MenuItem value={this.slugify(bot.name)}>{bot.name}</MenuItem>
          ))
        }else{
          return <MenuItem value={''}>You don't have bots yet!</MenuItem>

        }
      }
    }

    slugify(botName){
      const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
      const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
      const p = new RegExp(a.split('').join('|'), 'g')

      return botName
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    }

    submitForm(e){
      e.preventDefault()
      const err = this.validate()
      if (!err){
        this.props.addKeyMutation({
          variables:{
            key: this.state.key,
            secret: this.state.secret,
            type: this.state.type,
            description: this.state.description,
            exchange: this.state.exchange,
            validFrom: this.state.validFrom,
            validTo: this.state.validTo,
            active: this.state.active,
            botId: this.state.botId
          },
          refetchQueries: [{query: getKeysQuery}]
        })

        this.props.handleNewKeyDialogClose()
      }
    }

    validate(){
      let isError = false

      if(this.state.key.length < 1) {
        isError = true
        this.setState(state => ({ keyError: true }));
      }

      if(this.state.secret.length < 1) {
        isError = true
        this.setState(state => ({ secretError: true }));
      }

      if(this.state.exchange.length < 1) {
        isError = true
        this.setState(state => ({ exchangeError: true }));
      }

      if(this.state.botId.length < 1) {
        isError = true
        this.setState(state => ({ botIdError: true }));
      }

      return isError;

    }
}

export default compose(
  graphql(addKeyMutation,{name:'addKeyMutation'}),
  graphql(getBotsQuery, { // What follows is the way to pass a parameter to a query.
    name: 'getBotsQuery',
    options: (props) => {
      let user = JSON.parse(localStorage.getItem('user'))
      return {
        variables: {
          ownerId: user.authId
        }
      }
    }
  }),
  withStyles(styles)
)(AddKey)