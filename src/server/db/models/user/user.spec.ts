import { expect } from 'chai';
const db = require('../index')
const User = db.model('user')

describe('User model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('instanceMethods', () => {
    describe('correctPassword', () => {
      let jeanne

      beforeEach(() => {
        return User.create({
          email: 'jeanne@spectest.com',
          password: 'test'
        })
          .then(user => {
            jeanne = user
          })
      })

      it('returns true if the password is correct', () => {
        expect(jeanne.correctPassword('test')).to.be.equal(true)
      })

      it('returns false if the password is incorrect', () => {
        expect(jeanne.correctPassword('test2')).to.be.equal(false)
      })
    }) // end describe('correctPassword')
  }) // end describe('instanceMethods')
}) // end describe('User model')