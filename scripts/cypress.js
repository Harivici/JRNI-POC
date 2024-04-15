import cypress from 'cypress'
import  fse  from 'fs-extra'
import { merge } from 'mochawesome-merge'
import generator from 'mochawesome-report-generator'

  async function runTests() {
    await fse.remove('mochawesome-report')
    const { totalFailed } = await cypress.run()
    const jsonReport = await merge()
+   await generator.create(jsonReport)
    process.exit(totalFailed)
  }

  runTests()