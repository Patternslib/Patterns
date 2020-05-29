#!/usr/bin/env python
import pika
import sys

EXCHANGE = "quaive"


if len(sys.argv) < 2:
    print("Usage:")
    print("  python send.py ROUTING_KEY MESSAGE")
    print("Example:")
    print("  python send.py push_marker content_updated")
    sys.exit()


credentials = pika.PlainCredentials("admin", "admin")
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host="localhost", credentials=credentials)
)
channel = connection.channel()
channel.exchange_declare(exchange=EXCHANGE, exchange_type="topic")

routing_key = sys.argv[1]
message = " ".join(sys.argv[2:])

channel.basic_publish(exchange=EXCHANGE, routing_key=routing_key, body=message)

print(" [x] Sent %r:%r" % (routing_key, message))
connection.close()
