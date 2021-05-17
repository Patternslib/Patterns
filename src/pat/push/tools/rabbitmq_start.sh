# https://hub.docker.com/_/rabbitmq

# docker exec -it rabbitmq /bin/bash
# docker logs -f rabbitmq
# docker stop rabbitmq

# Ports:
# 5672   # queue
# 15672  # management port
# 15674  # stomp plugin

docker run\
    -d\
    --hostname rabbitmq\
    --name rabbitmq\
    -p 5672:5672\
    -p 15672:15672\
    -p 15674:15674\
    -e RABBITMQ_DEFAULT_USER=guest\
    -e RABBITMQ_DEFAULT_PASS=guest\
    --mount type=bind,source="$(pwd)"/rabbitmq_enabled_plugins,target=/etc/rabbitmq/enabled_plugins\
    rabbitmq:management

#
