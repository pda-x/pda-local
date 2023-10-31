# pda-local

pda本地化部署方案

## env

优先级: 系统环境变量 > .env

## 工具链

`unzip` `node` `pm2` `libplist` `jq` `python3-dev`

`libplist`编译时`make install && ldconfig`

## redis

`namespace` : `pda`

### keys

`pda:config` : project config info

`pda:ipa:[ipa file name]` : ipa info
