#!/bin/bash
# Notification to telegram chat

source /etc/environment

telegram_token=${TELEGRAM_API_TOKEN}
chat_id='-1001578860113'
stickers=(
  "CAACAgIAAxkBAAMCYR0zS2146CHLXg3_SYhiKm0aea8AAowAA66AcQw_S3cpmAzdHSAE"
  "CAACAgIAAx0CXht-UQADCGEdNBWSicj94m5WB1OHcye4N0W7AAKeAAOugHEMBgV4EnsmrYogBA"
  "CAACAgIAAx0CXht-UQADCWEdNFMdAAG4BtjGmEATCqD7MUDomgACuAADroBxDGUP_Xv-JYFdIAQ"
  "CAACAgIAAx0CXht-UQADCmEdNG-c0zAubNzpPW9ArEsuoeCsAALIAAOugHEM76LKZZcuCpMgBA"
  "CAACAgIAAx0CXht-UQADC2EdNI8b06LN2n0FrPzPQTQAAUD2GAACQAADroBxDOyJHUc1NFn1IAQ"
  "CAACAgIAAx0CXht-UQADDGEdNLMTLZxKy9mCYZlEdts0GPH9AAJBAAOugHEMmdAPo5aM3uogBA"
  "CAACAgIAAx0CXht-UQADDWEdNM2Wgc9hOSM0rsPjduOrl0qOAAISAANL-p8Z3m0DXqCDy9cgBA"
  "CAACAgIAAx0CXht-UQADDmEdNOkvZ48Bxu9_cIeTooXB3pp7AAIPAANL-p8ZdHW8r_MP5mUgBA"
  "CAACAgIAAx0CXht-UQADD2EdNQq4eLG0tcKCC6qM5M-xweLHAAIKAANL-p8Z1oUkoXrabAogBA"
  "CAACAgIAAx0CXht-UQADEGEdNS4XYnTuWHv9up77YukGohHpAAIRAANL-p8ZbrmbdYQT5jIgBA"
  "CAACAgIAAx0CXht-UQADEWEdNUY1lOEhUbA9QZqsc57qNiEgAAIQAANL-p8ZPhoDtXgNBfIgBA"
  "CAACAgIAAx0CXht-UQADEmEdNWk6ON5vuA6GwPhJEF_gyzs5AAIaAAOugHEMn4_ia-Nr0i8gBA"
)

function notify_sticker {
  sticker=${stickers[RANDOM % ${#stickers[@]}]}
  curl --location --request POST "https://api.telegram.org/bot${telegram_token}/sendMessage" \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode "sticker=${sticker}" \
        --data-urlencode "chat_id=${chat_id}"
}

function notify_text {
  curl --location --request POST "https://api.telegram.org/bot${telegram_token}/sendMessage" \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode "text=$1" \
        --data-urlencode "chat_id=${chat_id}"
}
