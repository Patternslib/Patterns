#!/usr/bin/env python
import pika
import sys


if len(sys.argv) < 3:
    print("Usage:")
    print("  python send.py EXCHANGE FILTER MESSAGE")
    print("Example:")
    print("  python send.py patternslib jane_doe.push_marker content_updated")
    sys.exit()


credentials = pika.PlainCredentials("guest", "guest")
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host="localhost", credentials=credentials)
)
channel = connection.channel()


exchange = sys.argv[1]
topicfilter = sys.argv[2]
message = " ".join(sys.argv[3:])

channel.exchange_declare(exchange=exchange, exchange_type="topic")
channel.basic_publish(exchange=exchange, routing_key=topicfilter, body=message)

print(" [x] Sent %r:%r" % (topicfilter, message))
connection.close()
