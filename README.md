# The /conv/ directory: Logic and rules for transliterating Pāḷi texts into Indic scripts in .CSV file format.

## What

https://paa.li/conv/ is the directory of these .csv files which function as Pāḷi text transliteration rules.

Some .csv files may contain values for alphabets not used in Pāḷi; such as `ṣ`, `r̥` etc.

Every values of the inner text of class="pi" elements that belong to the left column of the .csv files gets replaced by their right column counterpart.

Conversion starts from the top row to the bottom row. Once every values of the first row is replaced, the script moves onto work on the next row.

## List of files

deva.csv — Devanagari
sinh.csv — Sinhalese script
orya.csv — Odia script
beng.csv — Assamese-Bengali script; uses ৰ for `ba` and ব for `va`. (Examples of such orthography: 1 and 2)
mymr.csv — Mon-Burmese script; the Burmese standard Pāḷi orthography.
khmr.csv — Khmer script
brah.csv — Brahmi script
gran.csv — Grantha script
iso.csv — ISO 15919: A romanization standard of Indic languages; the default setting of PaaLi. (The file exists only to serve as a placeholder rule of the website.)
isom.csv — ISO 15919 but displays the default [niggahīta](https://en.wiktionary.org/wiki/niggahita) `ṁ` as `ṃ`.
