---
title: "快速解决gitlab-ci项目构建与发布问题"
date: 2026-09-18 15:38:44
description: "使用宿主机的docker和kubectl启动gitlab pod： ......runner部分操作省略......（参考原笔记） 如果想要一劳永逸的效果，可以对coredns的pod容器进行更改："
categories:
  - 比赛
tags:
  - 广东省技能大赛云计算
  - Kubernetes
  - GitLab
  - Docker
---

使用宿主机的docker和kubectl启动gitlab pod：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  namespace: default
  labels:
    app: gitlab
  name: gitlab
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitlab
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: gitlab
    spec:
      containers:
      - image: gitlab/gitlab-ce:16.2.0-ce.0
        name: gitlab-ce
        securityContext:
          #runAsUser: 0
          privileged: true
        env:
        - name: GITLAB_OMNIBUS_CONFIG
          value: |
            external_url 'http://10.4.220.101:31000'
            gitlab_rails['initial_root_password'] = 'Key-1122'
            gitlab_kas['enable'] = true
            gitlab_kas['listen_address'] = '0.0.0.0:8150'
        ports:
        - containerPort: 8150
        volumeMounts:
        - name: gitlab-data
          mountPath: /var/opt/gitlab
        - name: docker-sock
          mountPath: /var/run/docker.sock
        - name: docker-cli
          mountPath: /usr/bin/docker
        - name: kubectl-config
          mountPath: /root/.kube/config
        - name: kubectl-bin
          mountPath: /usr/bin/kubectl
      volumes:
      - name: gitlab-data
        persistentVolumeClaim:
          claimName: gitlabpvc
      - name: docker-sock
        hostPath:
          path: /var/run/docker.sock
      - name: docker-cli
        hostPath:
          path: /usr/bin/docker
      - name: kubectl-config
        hostPath:
          path: /root/.kube/config
      - name: kubectl-bin
        hostPath:
          path: /usr/bin/kubectl
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: gitlab
  name: gitlab
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 31000
    nodePort: 31000
  - name: kas
    port: 8150
    targetPort: 8150
  selector:
    app: gitlab
  type: NodePort
```

**......runner部分操作省略......（参考原笔记）**

如果想要一劳永逸的效果，可以对coredns的pod容器进行更改：

```
#修改配置，cm表示是编辑ConfigMap配置
kubectl edit cm coredns -n kube-system
```

```yaml
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        hosts {
            10.4.220.101 apiserver.cluster.local   #在这里添加hosts主机映射即可
            fallthrough  # 这个表示让k8s如果在这里没有找到匹配的主机解析就跳过，不要停在这里
        }
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
```