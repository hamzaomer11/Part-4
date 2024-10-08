const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const { PORT } = process.env
app.listen(PORT, () => {
   logger.info(`Server running on port ${config.PORT}`)
})