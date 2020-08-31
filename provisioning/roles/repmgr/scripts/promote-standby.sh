#!/usr/bin/env bash
# assign digital ocean floating ip address to postgres cluster promoted standby node
# this script is expected to run automatically on a standby node during its automated promotion

# promote PostgreSQL standby to primary
repmgr standby promote -f /etc/repmgr.conf

PROJECT_EXISTS=$(doctl projects list | wc -l)

if [ 2 -gt $PROJECT_EXISTS ]; then
  echo "doctl CLI is not properly configured. Exiting."
  exit 1
fi

CURRENT_NODE_ASSIGNED_NAME=$(doctl compute floating-ip list | awk '{print $4}' | tail -n 1) # pg1
STANDBY_NODE_NAME=$(doctl compute droplet list | grep "pg2" | awk '{print $2}') # pg2
STANDBY_NODE_ID=$(doctl compute droplet list | grep "pg2" | awk '{print $1}') # <do droplet resource id>
FLOATING_IP_ADDRESS=$(doctl compute floating-ip list | awk '{print $1}' | tail -n 1) # <do flip ipv4>

echo "$FLOATING_IP_ADDRESS is currently assigned to $CURRENT_NODE_ASSIGNED_NAME. Reassigning to $STANDBY_NODE_NAME."

# remote address change
doctl compute floating-ip-action assign $FLOATING_IP_ADDRESS $STANDBY_NODE_ID
