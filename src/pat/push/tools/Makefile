# https://hub.docker.com/_/rabbitmq

# docker exec -it rabbitmq /bin/bash
# docker logs -f rabbitmq

# Ports:
# 5672   # queue
# 15672  # management port
# 15674  # stomp plugin


RABBITMQ_NAME = patternslib-demo-rabbitmq


# DEMO SERVER

stamp-run:
	docker run\
		-d\
		--hostname rabbitmq\
		--name $(RABBITMQ_NAME)\
		-p 5672:5672\
		-p 15672:15672\
		-p 15674:15674\
		-e RABBITMQ_DEFAULT_USER=guest\
		-e RABBITMQ_DEFAULT_PASS=guest\
		--mount type=bind,source="$(shell pwd)"/rabbitmq_enabled_plugins,target=/etc/rabbitmq/enabled_plugins\
		rabbitmq:management
	touch stamp-run


.PHONY:
start: stamp-run
	docker start $(RABBITMQ_NAME)


.PHONY:
stop:
	docker stop $(RABBITMQ_NAME)


.PHONY:
log:
	docker logs -f $(RABBITMQ_NAME)


# DEMO PRODUCER

stamp-python:
	python -m venv .
	./bin/pip install pika
	touch stamp-python


.PHONY: send-update-1
send-update-1: stamp-python
	./bin/python send.py patternslib push_marker message_counter


.PHONY: send-update-2
send-update-2: stamp-python
	./bin/python send.py patternslib push_marker message_counter2



# MAINTENANCE

.PHONY:
clean: stop
	docker container rm $(shell docker container ls -a -q -f name=$(RABBITMQ_NAME))
	rm stamp-run
	rm -Rf bin/ include/ lib/ lib64 pyvenv.cfg share/ stamp-python

#
