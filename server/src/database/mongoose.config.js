import mongoose from 'mongoose'

// Be sure that this runs before any other mongoose code.

// To avoid deprecation warnings.
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
// More customizations
mongoose.set('strict', 'throw')