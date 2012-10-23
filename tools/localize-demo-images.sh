#!/bin/sh

if [ -z "$(git status --porcelain)" ]; then
    FILES=$(grep -lir 'src="https\?://.*\.\(jpg\|png\)"' demo)
    for FILE in $FILES; do
        IMGDIR=$(dirname "$FILE")/images
        if [ ! -d "$IMGDIR" ]; then
            mkdir "$IMGDIR"
        fi
        URLS=$(grep -oPi '(?<=src=")(https?://[^"]*\.(jpg|png))(?=")' "$FILE" | sort -u)
        for URL in $URLS; do
            IMG="$(basename $URL)"
            SUFFIX=${IMG:${#IMG}-3}; IMGWOS=${IMG:0:${#IMG}-4}
            i=1; while [ -f "$IMGDIR/$IMG" ]; do
               IMG="${IMGWOS}-${i}.${SUFFIX}"
               i=$(( $i + 1 ))
            done

            curl -o "$IMGDIR/$IMG" "$URL" && [ -f "$IMGDIR/$IMG" ] || {
                echo "$URL for $FILE couldn't be fetched"
                continue
            }

            MIME=$(file --mime-type -b "$IMGDIR/$IMG")
            if [ "${MIME:0:6}" != "image/" ]; then
                rm "$IMGDIR/$IMG"
                echo "$URL for $FILE doesn't seem to be an image anymore"
                continue
            fi

            git add "$IMGDIR/$IMG"

            echo "$IMG from $URL" >> "$IMGDIR/sources"
            sed -i "s#src=\"$URL\"#src=\"images/$IMG\"#g" "$FILE"
        done
        git add "$IMGDIR/sources"
        git add "$FILE"
    done

    git commit -m "localized demo images"
else
    echo "please run $0 only from a clean working tree"
fi
