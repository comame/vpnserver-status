const { exec: defaultExec } = require('child_process')
const { readFileSync } = require('fs')
const express = require('express')
const totp = require('totp-generator')

const appConfig = JSON.parse(readFileSync('/etc/maintenance.json'))
const otpSecret = appConfig.otpSecret

const app = express()

app.use((req, _res, next) => {
    const ip = req.ip
    console.log(`Request ${ip}`)
    next()
})

app.use(express.static(__dirname + '/'))

app.use('/api/**', (req, res, next) => {
    const token = totp(otpSecret)
    const requestedToken = req.header('Authorization')
    if (token != requestedToken) {
        res.status(403).send('Invalid TOTP')
        console.log('Invalid TOTP')
    } else {
        console.log(req.originalUrl)
        next()
    }
})

app.get('/api/restartSoftether', async (_req, res) => {
    try {
        await exec('sudo systemctl restart vpnserver')
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
        return
    }
    res.send('ok')
})

app.get('/api/statusSoftether', async (_req, res) => {
    const status = await exec('systemctl status vpnserver')
    res.send(status)
})

app.listen(2000, () => {
    console.log('Listening on 2000.')
})

async function exec(command) {
    return new Promise((resolve, reject) => {
        defaultExec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err)
            } else if (stderr) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        })
    })
}
