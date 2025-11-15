# The /conv/ directory: Logic and rules for transliterating Pāḷi texts into Indic scripts in .CSV file format.

## What

https://paa.li/conv/ is the directory of these .csv files which function as Pāḷi text transliteration rules.

Some .csv files may contain values for alphabets not used in Pāḷi; such as `ṣ`, `r̥` etc.

Every values of the inner text of class="pi" elements that belong to the left column of the .csv files gets replaced by their right column counterpart.

Conversion starts from the top row to the bottom row. Once every values of the first row is replaced, the script moves onto work on the next row.

## List of files

- [deva.csv](https://github.com/paa-li/conv/blob/main/deva.csv) — Devanagari
- [sinh.csv](https://github.com/paa-li/conv/blob/main/sinh.csv) — Sinhalese script
- [orya.csv](https://github.com/paa-li/conv/blob/main/sinh.csv) — Odia script
- [beng.csv](https://github.com/paa-li/conv/blob/main/beng.csv) — Assamese-Bengali script; uses ৰ for `ba` and ব for `va`. (Examples of such orthography: [1](https://w.wiki/G6kN) and [2](https://www.youtube.com/watch?v=G3v2RGgR7vU))
- [mymr.csv](https://github.com/paa-li/conv/blob/main/beng.csv) — Mon-Burmese script; the Burmese standard Pāḷi orthography.
- [khmr.csv](https://github.com/paa-li/conv/blob/main/khmr.csv) — Khmer script
- [brah.csv](https://github.com/paa-li/conv/blob/main/brah.csv) — Brahmi script
- [gran.csv](https://github.com/paa-li/conv/blob/main/gran.csv) — Grantha script

### In progress:

- [thai.csv](https://github.com/paa-li/conv/blob/main/thai.csv) — Thai script
- [laoo.csv](https://github.com/paa-li/conv/blob/main/laoo.csv) — Lao script; will use ຬ U+0EAC for `ḷa`

Have a better look at these .csv files at the website's [CSV file viewer](https://paa.li/conv/csv.php?id=deva.csv) where you can easily see the decoded unicode values.
