import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

const inputPath = path.resolve('avocado.csv')
const outputPath = path.resolve('avocado_cleaned.csv')

const essentialColumns = [
  'Date',
  'AveragePrice',
  'Total Volume',
  'type',
  'year',
  'region',
]

const cleanedRows = []

function escapeCsvValue(value) {
  const str = value == null ? '' : String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    const cleanedRow = {}
    for (const column of essentialColumns) {
      cleanedRow[column] = row[column]
    }
    cleanedRows.push(cleanedRow)
  })
  .on('end', () => {
    const header = essentialColumns.join(',')
    const lines = cleanedRows.map((row) => (
      essentialColumns.map((column) => escapeCsvValue(row[column])).join(',')
    ))
    const csvOutput = [header, ...lines].join('\n')

    fs.writeFileSync(outputPath, csvOutput, 'utf-8')
    console.log(`Done. Saved ${cleanedRows.length} rows to ${outputPath}`)
  })
  .on('error', (err) => {
    console.error('Failed to process CSV:', err.message)
    process.exit(1)
  })