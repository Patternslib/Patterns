# https://hub.docker.com/_/rabbitmq
# docker exec -it rabbitmq /bin/bash
# docker logs -f rabbitmq
docker run\
    -d\
    --hostname rabbitmq\
    --name rabbitmq\
    -p 5672:5672\
    -p 15672:15672\
    -p 15674:15674\
    -e RABBITMQ_DEFAULT_USER=admin\
    -e RABBITMQ_DEFAULT_PASS=admin\
    --mount type=bind,source="$(pwd)"/rabbitmq_enabled_plugins,target=/etc/rabbitmq/enabled_plugins\
    rabbitmq:management

