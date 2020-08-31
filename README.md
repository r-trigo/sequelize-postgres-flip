# Sequelize client for PostgreSQL cluster with repmgr and floating IP

## Floating IP network interface configuration
Floating IP address provider will forward requests to the node which it is currently assigned. Configure the node network interface to listen to this address. Perform this configuration on both primary and standby nodes:

```bash
cat > /etc/netplan/60-floating-ip.yaml << EOF
network:
  version: 2
  ethernets:
    eth0:
      addresses:
      - $FLOATING_IP_ADDRESS/32
EOF

netplan apply
```

*Remember to add this address to the firewall in order to allow requests from and to it.*

## Configure standby doctl (DigitalOcean CLI) to reassign FLIP
```bash
sudo apt update && sudo snap install doctl
doctl auth init --context
# enter project API token
```
