#!/bin/bash
OUTFILE=fonts.ts
echo "// tslint:disable" > $OUTFILE
echo "export const fonts: string[] = [" >> $OUTFILE
for font in $(ls *.bdf)
do

    FONTNAME=$(echo $font | cut -d "." -f1)
    echo "    \"$FONTNAME\"," >> $OUTFILE

done;

echo "];" >> $OUTFILE