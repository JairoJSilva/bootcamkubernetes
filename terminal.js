// Simulador de Terminal Interativo Kubectl & Minikube em Português

class K8sTerminalSimulator {
  constructor(containerId, inputId, onCommandExecuted) {
    this.container = document.getElementById(containerId);
    this.input = document.getElementById(inputId);
    this.onCommandExecuted = onCommandExecuted;
    this.history = [];
    this.historyIndex = -1;

    // Estado virtual do Cluster
    this.state = {
      minikubeRunning: true,
      minikubeIp: "192.168.49.2",
      deploymentName: "kubernetes-bootcamp",
      image: "gcr.io/google-samples/kubernetes-bootcamp:v1",
      imageVersion: "v1",
      replicas: 1,
      proxyRunning: false,
      serviceExposed: false,
      nodePort: 31456,
      labels: { app: "kubernetes-bootcamp" },
      pods: [
        { name: "kubernetes-bootcamp-57978f5f5d-kx982", ip: "10.244.0.5", status: "Running", restarts: 0, age: "5m" }
      ],
      configMaps: {},
      secrets: {},
      lastRolloutState: "v1",
      previousImage: "gcr.io/google-samples/kubernetes-bootcamp:v1"
    };

    this.initListeners();
    this.printBanner();
  }

  printBanner() {
    this.print(
      `<span class="term-info">===============================================================</span>\n` +
      `<span class="term-cyan">☸️  SIMULADOR DE TERMINAL INTERATIVO KUBERNETES BOOTCAMP</span>\n` +
      `<span class="term-muted">Simulador oficial com auto-cura, réplicas dinâmicas e balanceamento de carga.</span>\n` +
      `<span class="term-muted">Digite comandos kubectl ou clique em '▶ Executar' nos passos para testar!</span>\n` +
      `<span class="term-info">===============================================================</span>\n`
    );
  }

  initListeners() {
    if (!this.input) return;

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
          this.input.value = "";
        }
      } else if (e.key === "ArrowUp") {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      }
    });
  }

  print(htmlText) {
    if (!this.container) return;
    const div = document.createElement("div");
    div.className = "term-line";
    div.innerHTML = htmlText;
    this.container.appendChild(div);
    this.container.scrollTop = this.container.scrollHeight;
  }

  execute(rawCmd) {
    // Linha de comando com prompt em português
    this.print(`<span class="term-prompt">aluno@k8s-box:~$</span> <span class="term-cmd">${this.escapeHtml(rawCmd)}</span>`);

    const trimmed = rawCmd.trim();
    const cleanCmd = trimmed.replace(/\s+/g, " ");

    let output = "";

    // 1. Limpar tela
    if (cleanCmd === "clear") {
      this.container.innerHTML = "";
      this.printBanner();
      if (this.onCommandExecuted) this.onCommandExecuted(rawCmd);
      return;
    }

    // 2. Comandos Minikube
    if (cleanCmd === "minikube version") {
      output = `<span class="term-green">versão do minikube: v1.32.0</span>\ncommit do build: 8220a6eb95f0a4d75f7f2d7b1414121084f4d7b6`;
    } else if (cleanCmd === "minikube start") {
      this.state.minikubeRunning = true;
      output = `😄  minikube v1.32.0 no Linux (amd64)\n✨  Iniciando nó de control plane 'minikube' no cluster minikube\n🚜  Baixando imagem base ...\n🔥  Criando cluster Kubernetes de nó único ...\n🐳  Configurando ambiente para o runtime de containers ...\n🏄  Pronto! O kubectl agora está configurado para usar o cluster 'minikube'.`;
    } else if (cleanCmd === "minikube status") {
      output = `minikube\ntipo: Control Plane\nhost: Em Execução (Running)\nkubelet: Em Execução (Running)\napiserver: Em Execução (Running)\nkubeconfig: Configurado com Sucesso`;
    } else if (cleanCmd === "minikube ip") {
      output = this.state.minikubeIp;
    } else if (cleanCmd === "minikube stop") {
      this.state.minikubeRunning = false;
      output = `✋  Parando nó "minikube" ...\n🛑  Desligando "minikube" com segurança ...\n🛑  1 nó parado com sucesso.`;
    }

    // 3. Kubectl cluster info e version
    else if (cleanCmd === "kubectl version" || cleanCmd === "kubectl version --client") {
      output = `Versão do Cliente (Client): v1.28.2\nVersão do Servidor (Control Plane): v1.28.2\nControl plane do Kubernetes em perfeito estado!`;
    } else if (cleanCmd === "kubectl cluster-info") {
      output = `<span class="term-cyan">Control plane do Kubernetes</span> está rodando em https://${this.state.minikubeIp}:8443\n<span class="term-cyan">Serviço CoreDNS</span> está rodando em https://${this.state.minikubeIp}:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy`;
    } else if (cleanCmd === "kubectl get nodes" || cleanCmd === "kubectl get nodes -o wide") {
      output = `<span class="term-head">NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION</span>\nminikube   Ready    control-plane   18m   v1.28.2   ${this.state.minikubeIp}   &lt;none&gt;        Ubuntu 22.04.3 LTS   5.15.0-1048-aws`;
    }

    // 4. Kubectl create deployment
    else if (cleanCmd.startsWith("kubectl create deployment")) {
      const match = cleanCmd.match(/kubectl create deployment\s+([\w-]+)\s+--image=([^\s]+)/);
      if (match) {
        this.state.deploymentName = match[1];
        this.state.image = match[2];
        this.state.imageVersion = match[2].includes("v2") ? "v2" : match[2].includes("v10") ? "v10" : "v1";
        this.state.replicas = 1;
        this.updatePods();
        output = `deployment.apps/${this.state.deploymentName} criado com sucesso`;
      } else {
        output = `deployment.apps/kubernetes-bootcamp criado com sucesso`;
      }
    }

    // 5. Kubectl get deployments
    else if (cleanCmd === "kubectl get deployments" || cleanCmd === "kubectl get deployment") {
      const ready = this.state.imageVersion === "v10" ? `1/${this.state.replicas}` : `${this.state.replicas}/${this.state.replicas}`;
      const avail = this.state.imageVersion === "v10" ? 1 : this.state.replicas;
      output = `<span class="term-head">NAME                  READY   UP-TO-DATE   AVAILABLE   AGE</span>\n${this.state.deploymentName}   ${ready}     ${avail}            ${avail}           8m`;
    }

    // 6. Kubectl get rs
    else if (cleanCmd.startsWith("kubectl get rs")) {
      output = `<span class="term-head">NAME                             DESIRED   CURRENT   READY   AGE</span>\n${this.state.deploymentName}-57978f5f5d   ${this.state.replicas}         ${this.state.replicas}         ${this.state.replicas}       8m`;
    }

    // 7. Kubectl get pods
    else if (cleanCmd.startsWith("kubectl get pods") || cleanCmd.startsWith("kubectl get pod")) {
      if (cleanCmd.includes("-l tier=frontend")) {
        const p = this.state.pods[0];
        output = `<span class="term-head">NAME                                   READY   STATUS    RESTARTS   AGE</span>\n${p.name}   1/1     ${p.status}   0          6m`;
      } else if (cleanCmd.includes("-o wide")) {
        let lines = [`<span class="term-head">NAME                                   READY   STATUS             RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES</span>`];
        this.state.pods.forEach(p => {
          lines.push(`${p.name}   ${p.status === "Running" ? "1/1" : "0/1"}     ${p.status.padEnd(18)} 0          ${p.age}   ${p.ip.padEnd(12)} minikube   &lt;none&gt;           &lt;none&gt;`);
        });
        output = lines.join("\n");
      } else if (cleanCmd.includes("-o go-template")) {
        output = this.state.pods[0].name;
      } else {
        let lines = [`<span class="term-head">NAME                                   READY   STATUS             RESTARTS   AGE</span>`];
        this.state.pods.forEach(p => {
          lines.push(`${p.name}   ${p.status === "Running" ? "1/1" : "0/1"}     ${p.status.padEnd(18)} 0          ${p.age}`);
        });
        output = lines.join("\n");
      }
    }

    // 8. Kubectl describe pod
    else if (cleanCmd.startsWith("kubectl describe pod")) {
      const p = this.state.pods[0];
      output = `Name:             ${p.name}\nNamespace:        default\nNode:             minikube/${this.state.minikubeIp}\nStatus:           ${p.status}\nIP:               ${p.ip}\nLabels:           app=${this.state.deploymentName}${this.state.labels.tier ? ",tier=" + this.state.labels.tier : ""}\nContainers:\n  ${this.state.deploymentName}:\n    Image:          ${this.state.image}\n    Port:           8080/TCP\n    State:          ${p.status === "Running" ? "Running" : "Waiting"}\nEvents:\n  Type    Reason     Age   From               Message\n  ----    ------     ----  ----               -------\n  Normal  Scheduled  5m    default-scheduler  Pod alocado com sucesso no nó minikube\n  Normal  Pulled     5m    kubelet            Imagem "${this.state.image}" baixada com sucesso\n  Normal  Created    5m    kubelet            Container ${this.state.deploymentName} criado\n  Normal  Started    5m    kubelet            Container ${this.state.deploymentName} iniciado e ativo`;
    }

    // 9. Kubectl logs
    else if (cleanCmd.startsWith("kubectl logs")) {
      output = `<span class="term-cyan">Aplicação Kubernetes Bootcamp Iniciada!</span>\nServidor ouvindo conexões na porta 8080...\nHorário do Log: ${new Date().toLocaleString("pt-BR")}\nTempo em atividade: 320 segundos | Total de Requisições: 12`;
    }

    // 10. Kubectl exec
    else if (cleanCmd.includes("kubectl exec") && cleanCmd.includes("env")) {
      output = `KUBERNETES_SERVICE_PORT=443\nKUBERNETES_PORT=tcp://10.96.0.1:443\nHOSTNAME=${this.state.pods[0].name}\nNODE_VERSION=14.17.0\nHOME=/root\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`;
    } else if (cleanCmd.includes("kubectl exec") && cleanCmd.includes("curl localhost:8080")) {
      output = `Olá do Kubernetes Bootcamp! | Rodando no Pod: ${this.state.pods[0].name} | Versão da App: v=${this.state.imageVersion === "v2" ? "2" : "1"}`;
    }

    // 11. Kubectl expose
    else if (cleanCmd.startsWith("kubectl expose")) {
      this.state.serviceExposed = true;
      output = `service/${this.state.deploymentName} exposto com sucesso`;
    }

    // 12. Kubectl get services
    else if (cleanCmd.startsWith("kubectl get services") || cleanCmd.startsWith("kubectl get service") || cleanCmd.startsWith("kubectl get svc")) {
      if (this.state.serviceExposed) {
        output = `<span class="term-head">NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE</span>\nkubernetes            ClusterIP   10.96.0.1        &lt;none&gt;        443/TCP          25m\n${this.state.deploymentName}   NodePort    10.105.120.44    &lt;none&gt;        8080:${this.state.nodePort}/TCP   1m`;
      } else {
        output = `<span class="term-head">NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE</span>\nkubernetes   ClusterIP   10.96.0.1    &lt;none&gt;        443/TCP   25m`;
      }
    }

    // 13. Kubectl describe service
    else if (cleanCmd.startsWith("kubectl describe service")) {
      const endpoints = this.state.pods.map(p => `${p.ip}:8080`).join(",");
      output = `Name:                     ${this.state.deploymentName}\nNamespace:                default\nLabels:                   app=${this.state.deploymentName}\nSelector:                 app=${this.state.deploymentName}\nType:                     NodePort\nIP:                       10.105.120.44\nPort:                     &lt;unset&gt;  8080/TCP\nTargetPort:               8080/TCP\nNodePort:                 &lt;unset&gt;  ${this.state.nodePort}/TCP\nEndpoints:                ${endpoints}`;
    }

    // 14. Kubectl label
    else if (cleanCmd.startsWith("kubectl label")) {
      if (cleanCmd.includes("tier=frontend")) {
        this.state.labels.tier = "frontend";
      }
      output = `pod/${this.state.pods[0].name} rotulado com sucesso`;
    }

    // 15. Kubectl delete service
    else if (cleanCmd.startsWith("kubectl delete service") || cleanCmd.startsWith("kubectl delete svc")) {
      this.state.serviceExposed = false;
      output = `service "${this.state.deploymentName}" excluído com sucesso`;
    }

    // 16. Kubectl scale
    else if (cleanCmd.startsWith("kubectl scale")) {
      const match = cleanCmd.match(/--replicas=(\d+)/);
      if (match) {
        this.state.replicas = parseInt(match[1], 10);
        this.updatePods();
        output = `deployment.apps/${this.state.deploymentName} escalado para ${this.state.replicas} réplicas com sucesso`;
      } else {
        output = `deployment.apps/${this.state.deploymentName} escalado com sucesso`;
      }
    }

    // 17. Kubectl set image (Rolling updates)
    else if (cleanCmd.startsWith("kubectl set image")) {
      const match = cleanCmd.match(/kubernetes-bootcamp=([^\s]+)/);
      if (match) {
        this.state.previousImage = this.state.image;
        this.state.image = match[1];
        if (this.state.image.includes("v10")) {
          this.state.imageVersion = "v10";
          this.updatePods();
          output = `deployment.apps/${this.state.deploymentName} imagem atualizada (Aguardando conclusão do rollout...)`;
        } else if (this.state.image.includes("v2")) {
          this.state.imageVersion = "v2";
          this.updatePods();
          output = `deployment.apps/${this.state.deploymentName} imagem atualizada para versão v2 com sucesso`;
        } else {
          this.state.imageVersion = "v1";
          this.updatePods();
          output = `deployment.apps/${this.state.deploymentName} imagem atualizada com sucesso`;
        }
      }
    }

    // 18. Kubectl rollout status
    else if (cleanCmd.startsWith("kubectl rollout status")) {
      if (this.state.imageVersion === "v10") {
        output = `<span class="term-yellow">Aguardando rollout do deployment "${this.state.deploymentName}": 1 de ${this.state.replicas} réplicas prontas...</span>\n<span class="term-danger">erro: o deployment "${this.state.deploymentName}" excedeu o tempo limite de prontidão (ImagePullBackOff)</span>`;
      } else {
        output = `<span class="term-green">deployment "${this.state.deploymentName}" atualizado com sucesso (rollout concluído sem indisponibilidade)</span>`;
      }
    }

    // 19. Kubectl rollout undo
    else if (cleanCmd.startsWith("kubectl rollout undo")) {
      this.state.image = this.state.previousImage || "jocatalin/kubernetes-bootcamp:v2";
      this.state.imageVersion = this.state.image.includes("v2") ? "v2" : "v1";
      this.updatePods();
      output = `deployment.apps/${this.state.deploymentName} revertido com sucesso para a revisão anterior estável`;
    }

    // 20. Kubectl describe pods grep Image
    else if (cleanCmd.includes("kubectl describe pods") && cleanCmd.includes("Image")) {
      let lines = [];
      this.state.pods.forEach(() => {
        lines.push(`    Image:          ${this.state.image}`);
      });
      output = lines.join("\n");
    }

    // 21. ConfigMaps e Secrets
    else if (cleanCmd.startsWith("kubectl create configmap")) {
      output = `configmap/app-config criado com sucesso`;
    } else if (cleanCmd.startsWith("kubectl describe configmap")) {
      output = `Name:         app-config\nNamespace:    default\nLabels:       &lt;none&gt;\nAnnotations:  &lt;none&gt;\n\nData\n====\nAPP_NAME:\n----\nmeu-sistema-k8s\n\nBinaryData\n====\n\nEvents:  &lt;none&gt;`;
    } else if (cleanCmd.startsWith("kubectl create secret")) {
      output = `secret/db-credentials criado com sucesso`;
    } else if (cleanCmd.startsWith("kubectl get secret")) {
      output = `apiVersion: v1\ndata:\n  password: U3VwZXJTZWNyZXRLOHNQd2Q=\n  username: YWRtaW4=\nkind: Secret\nmetadata:\n  creationTimestamp: "2026-09-16T15:00:00Z"\n  name: db-credentials\n  namespace: default\ntype: Opaque`;
    }

    // 22. Testes de requisição HTTP com Curl
    else if (cleanCmd.includes("curl") && (cleanCmd.includes("192.168.49.2") || cleanCmd.includes("localhost:8001") || cleanCmd.includes("minikube ip"))) {
      if (cleanCmd.includes("for i in")) {
        let lines = [];
        for (let i = 0; i < Math.min(this.state.replicas, 4); i++) {
          const pod = this.state.pods[i] || this.state.pods[0];
          lines.push(`Olá do Kubernetes Bootcamp! | Atendido pelo Pod: ${pod.name} | Versão: v=${this.state.imageVersion === "v2" ? "2" : "1"}`);
        }
        output = lines.join("\n");
      } else if (cleanCmd.includes("8001/version")) {
        output = `{\n  "major": \"1\",\n  "minor": \"28\",\n  "gitVersion": \"v1.28.2\",\n  "platform": \"linux/amd64\"\n}`;
      } else {
        const randomPod = this.state.pods[Math.floor(Math.random() * this.state.pods.length)];
        output = `Olá do Kubernetes Bootcamp! | Atendido pelo Pod: ${randomPod.name} | Versão: v=${this.state.imageVersion === "v2" ? "2" : "1"}`;
      }
    }

    // 23. Proxy em segundo plano
    else if (cleanCmd === "kubectl proxy &" || cleanCmd === "kubectl proxy") {
      this.state.proxyRunning = true;
      output = `Proxy iniciado com sucesso! Escutando requisições em 127.0.0.1:8001`;
    }

    // 24. Ajuda do Simulador
    else if (cleanCmd === "help" || cleanCmd === "ajuda") {
      output = `Comandos suportados no simulador:\n- minikube [start|status|ip|version|stop]\n- kubectl [version|cluster-info|get nodes]\n- kubectl [create deployment|get deployments|scale|set image]\n- kubectl [get pods|describe pod|logs|exec]\n- kubectl [expose|get services|describe service|label|delete service]\n- kubectl [rollout status|rollout undo]\n- kubectl [create configmap|describe configmap|create secret|get secret]\n- curl [endpoint]\n- clear (limpa o terminal)`;
    }

    // Resposta padrão
    else {
      output = `<span class="term-green">Comando executado: ${this.escapeHtml(rawCmd)}</span>`;
    }

    if (output) {
      this.print(output);
    }

    // Notifica o app principal sobre o comando executado
    if (this.onCommandExecuted) {
      this.onCommandExecuted(rawCmd);
    }
  }

  updatePods() {
    this.state.pods = [];
    const hashes = ["kx982", "ab123", "cd456", "ef789", "gh012", "ij345"];
    for (let i = 0; i < this.state.replicas; i++) {
      const hash = hashes[i % hashes.length];
      const podName = `${this.state.deploymentName}-${this.state.imageVersion === "v2" ? "6b877fffc7" : "57978f5f5d"}-${hash}`;
      let status = "Running";
      if (this.state.imageVersion === "v10" && i === this.state.replicas - 1) {
        status = "ImagePullBackOff";
      }
      this.state.pods.push({
        name: podName,
        ip: `10.244.0.${5 + i}`,
        status: status,
        restarts: 0,
        age: "2m"
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
