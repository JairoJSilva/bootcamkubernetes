// Base de dados completa dos Módulos, Laboratórios, Quizzes e Emblemas do Kubernetes Bootcamp em Português

const BOOTCAMP_DATA = {
  badges: [
    {
      id: "badge-cluster",
      title: "Gênese do Cluster",
      module: 1,
      icon: "⚡",
      desc: "Iniciou seu primeiro cluster Minikube e inspecionou nós com o Kubectl.",
      xp: 200
    },
    {
      id: "badge-deploy",
      title: "Primeiro Deploy",
      module: 2,
      icon: "🚀",
      desc: "Implantou sua primeira aplicação gerenciada com Deployment e auto-cura.",
      xp: 250
    },
    {
      id: "badge-troubleshoot",
      title: "Detetive de Pods",
      module: 3,
      icon: "🔍",
      desc: "Dominou o diagnóstico de containers com describe, logs e exec interativo.",
      xp: 300
    },
    {
      id: "badge-service",
      title: "Arquiteto de Redes",
      module: 4,
      icon: "🌐",
      desc: "Criou Services NodePort, mapeou Endpoints e controlou tráfego com Labels.",
      xp: 350
    },
    {
      id: "badge-scale",
      title: "Mestre do Escalonamento",
      module: 5,
      icon: "⚖️",
      desc: "Escalou réplicas horizontalmente e comprovou o balanceamento dinâmico de tráfego.",
      xp: 400
    },
    {
      id: "badge-rolling",
      title: "Zero-Downtime Hero",
      module: 6,
      icon: "🔄",
      desc: "Executou Rolling Update com zero indisponibilidade e recuperou de falhas com Rollback.",
      xp: 450
    },
    {
      id: "badge-secrets",
      title: "Guardião da Configuração",
      module: 7,
      icon: "🛡️",
      desc: "Desacoplou código de configurações sensíveis utilizando ConfigMaps e Secrets.",
      xp: 500
    },
    {
      id: "badge-master",
      title: "Timoneiro Supremo",
      module: "all",
      icon: "👑",
      desc: "Concluiu 100% dos módulos, laboratórios e desafios práticos do Kubernetes Bootcamp!",
      xp: 1000
    }
  ],

  modules: [
    {
      id: 1,
      title: "1. Criando um Cluster Kubernetes",
      subtitle: "Arquitetura Master/Worker, Minikube e Inspeção Inicial",
      badgeId: "badge-cluster",
      duration: "15 min",
      xpTotal: 400,
      theory: `
        <h3>Visão Geral e Conceitos Fundamentais</h3>
        <p>O <strong>Kubernetes</strong> (do grego <em>κυβερνήτης</em>, "timoneiro" ou "piloto", raiz da palavra cibernética) é uma plataforma open-source de nível de produção desenvolvida originalmente pelo Google para orquestrar e automatizar o deploy, escalonamento e gerenciamento de aplicações em containers em clusters de computadores.</p>
        
        <div class="callout callout-info">
          <strong>Abreviação K8s:</strong> Obtida ao substituir as 8 letras entre 'K' e 's' ("ubernete") pelo número 8.
        </div>

        <h3>A Estrutura de um Cluster Kubernetes</h3>
        <p>Um cluster é formado por dois tipos fundamentais de recursos computacionais:</p>
        <ul>
          <li><strong>Master (Control Plane)</strong>: O cérebro que coordena todo o cluster. Responsável por agendar aplicações (scheduling), manter o estado desejado (desired state), coordenar escalonamento e executar atualizações incrementais (rolling updates). Composto por <code>kube-apiserver</code>, <code>etcd</code>, <code>kube-scheduler</code> e <code>kube-controller-manager</code>.</li>
          <li><strong>Nodes (Worker Machines)</strong>: Servidores físicos ou máquinas virtuais que trabalham executando os containers. Cada nó contém:
            <ul>
              <li><strong>Container Runtime</strong>: Motor que baixa imagens e executa containers (Docker, containerd, CRI-O).</li>
              <li><strong>Kubelet</strong>: Agente do nó que se comunica com o Master e garante que os containers descritos nas especificações estejam saudáveis e em execução.</li>
              <li><strong>Kube-proxy</strong>: Gerencia as regras de rede, NAT e encaminhamento de tráfego.</li>
            </ul>
          </li>
        </ul>

        <div class="callout callout-warning">
          <strong>Requisito de Produção:</strong> Para ambientes corporativos com alta disponibilidade e tolerância a falhas, o cluster deve possuir no mínimo <strong>3 Worker Nodes</strong>.
        </div>

        <h3>Desenvolvimento Local com Minikube</h3>
        <p>O <strong>Minikube</strong> é uma ferramenta CLI oficial que provisiona uma VM ou container local rodando um cluster Kubernetes de nó único (single-node), otimizado para testes e desenvolvimento rápido no dia a dia.</p>
      `,
      lab: {
        title: "Laboratório Prático: Inicializando o Cluster e Inspecionando Nós",
        steps: [
          {
            num: 1,
            instruction: "Verifique a versão instalada do utilitário Minikube.",
            command: "minikube version",
            expectedOutput: "versão do minikube: v1.32.0",
            tip: "Clique no botão '▶ Executar' ou digite o comando no terminal interativo ao lado."
          },
          {
            num: 2,
            instruction: "Inicialize o cluster local do Minikube.",
            command: "minikube start",
            expectedOutput: "😄  minikube v1.32.0 no Linux (amd64)\n✨  Iniciando nó de control plane 'minikube' no cluster minikube\n🚜  Baixando imagem base ...\n🔥  Criando cluster Kubernetes de nó único ...\n🐳  Configurando ambiente para o runtime de containers ...\n🏄  Pronto! O kubectl agora está configurado para usar o cluster 'minikube'.",
            tip: "Este comando inicia o container do nó e inicializa os componentes do Control Plane."
          },
          {
            num: 3,
            instruction: "Inspecione a versão do cliente (kubectl) e do servidor (control plane).",
            command: "kubectl version",
            expectedOutput: "Versão do Cliente (Client): v1.28.2\nVersão do Servidor (Control Plane): v1.28.2\nControl plane do Kubernetes em perfeito estado!",
            tip: "O cliente é o seu executável local; o server é o Kube-Apiserver rodando no nó."
          },
          {
            num: 4,
            instruction: "Exiba os endpoints principais de coordenação do cluster.",
            command: "kubectl cluster-info",
            expectedOutput: "Control plane do Kubernetes está rodando em https://192.168.49.2:8443\nServiço CoreDNS está rodando em https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy",
            tip: "Útil para confirmar se a API está online e acessível."
          },
          {
            num: 5,
            instruction: "Liste os nós de trabalho disponíveis no cluster e verifique se estão 'Ready'.",
            command: "kubectl get nodes",
            expectedOutput: "NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION\nminikube   Ready    control-plane   18m   v1.28.2   192.168.49.2   <none>        Ubuntu 22.04.3 LTS   5.15.0-1048-aws",
            tip: "O status 'Ready' significa que o nó está pronto para receber e agendar Pods."
          }
        ]
      },
      quiz: [
        {
          question: "Em sua essência fundamental, o que é a plataforma Kubernetes?",
          answers: [
            { text: "Uma ferramenta de provisionamento e configuração de servidores (como Puppet ou Ansible).", isCorrect: false, note: "O Kubernetes agenda cargas em nós existentes, mas não é um gerenciador de SO/máquinas como Ansible." },
            { text: "Uma plataforma de orquestração para executar e agendar containers em um cluster distribuído.", isCorrect: true, note: "Exato! O K8s orquestra, gerencia o ciclo de vida e agenda containers entre múltiplos nós." },
            { text: "Um formato ou ferramenta para empacotar código em containers (como Docker ou Buildah).", isCorrect: false, note: "O empacotamento é feito pelo Docker/OCI. O Kubernetes apenas consome essas imagens empacotadas." }
          ]
        },
        {
          question: "Em um cluster Kubernetes, qual é a definição e função de um Node?",
          answers: [
            { text: "É uma máquina trabalhadora (worker, física ou VM) onde os Pods e containers rodam.", isCorrect: true, note: "Correto! O nó é onde as cargas de trabalho da aplicação são executadas." },
            { text: "É a máquina mestre exclusiva encarregada de coordenar o cluster e agendar pods.", isCorrect: false, note: "A coordenação cabe ao Control Plane (Master)." },
            { text: "É uma ferramenta de linha de comando para iniciar clusters locais.", isCorrect: false, note: "A ferramenta de provisionamento local é o Minikube." }
          ]
        },
        {
          question: "Qual é a recomendação canônica de nós de trabalho (workers) para um cluster em ambiente produtivo?",
          answers: [
            { text: "Apenas 1 nó é suficiente caso possua bastante memória RAM.", isCorrect: false, note: "Se o nó cair, haverá indisponibilidade total (Single Point of Failure)." },
            { text: "No mínimo 3 nós para garantir alta disponibilidade e tolerância a falhas de hardware.", isCorrect: true, note: "Excelente! Três nós garantem quorum e resiliência se um nó falhar ou entrar em manutenção." },
            { text: "Exatamente 2 nós, nunca mais do que isso.", isCorrect: false, note: "Dois nós não oferecem tolerância ideal a partições de rede e falhas concorrentes." }
          ]
        }
      ]
    },

    {
      id: 2,
      title: "2. Deploy de Aplicações e Desired State",
      subtitle: "Deployments, Auto-Cura (Self-Healing) e Kubectl Proxy",
      badgeId: "badge-deploy",
      duration: "15 min",
      xpTotal: 450,
      theory: `
        <h3>O que é um Deployment?</h3>
        <p>No Kubernetes, aplicações não são iniciadas por scripts imperativos soltos. Um <strong>Deployment</strong> é um controlador declarativo responsável por:</p>
        <ul>
          <li>Criar e atualizar continuamente instâncias da sua aplicação.</li>
          <li>Informar ao Master onde agendar os Pods correspondentes.</li>
          <li>Garantir o <strong>Desired State</strong> (estado desejado): se você definiu 3 instâncias, o controlador mantém 3 instâncias vivas o tempo todo.</li>
        </ul>

        <h3>Auto-Cura (Self-Healing)</h3>
        <p>Se um nó travar, faltar energia física ou um container quebrar criticamente, o <strong>Deployment Controller</strong> detecta a anomalia e automaticamente recria réplicas idênticas em outros nós saudáveis do cluster. Isso resolve o problema de scripts legados que morriam sem recuperação.</p>

        <h3>Isolamento de Rede e o Kubectl Proxy</h3>
        <p>Pods rodam em uma rede privada isolada dentro do cluster, não acessível externamente por padrão. Para depurar ou inspecionar a API da aplicação diretamente pelo terminal sem expor uma porta externa, utilizamos o <code>kubectl proxy</code>, que cria um túnel autenticado entre o <code>localhost:8001</code> e o cluster.</p>
      `,
      lab: {
        title: "Laboratório Prático: Criando seu Primeiro Deployment e Acessando via Proxy",
        steps: [
          {
            num: 1,
            instruction: "Crie um novo Deployment chamado 'kubernetes-bootcamp' usando a imagem oficial do Bootcamp.",
            command: "kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1",
            expectedOutput: "deployment.apps/kubernetes-bootcamp criado com sucesso",
            tip: "O comando instrui o Master a agendar 1 réplica da aplicação no nó."
          },
          {
            num: 2,
            instruction: "Liste os Deployments criados e examine as colunas READY e AVAILABLE.",
            command: "kubectl get deployments",
            expectedOutput: "NAME                  READY   UP-TO-DATE   AVAILABLE   AGE\nkubernetes-bootcamp   1/1     1            1           8m",
            tip: "READY '1/1' confirma que 1 réplica desejada está saudável e pronta."
          },
          {
            num: 3,
            instruction: "Inicie o proxy da API do Kubernetes em segundo plano para inspecionar endpoints.",
            command: "kubectl proxy &",
            expectedOutput: "Proxy iniciado com sucesso! Escutando requisições em 127.0.0.1:8001",
            tip: "O proxy encaminha requisições da sua máquina local diretamente para a API REST do K8s."
          },
          {
            num: 4,
            instruction: "Consulte a versão da API do cluster através do túnel localhost criado pelo proxy.",
            command: "curl http://localhost:8001/version",
            expectedOutput: "{\n  \"major\": \"1\",\n  \"minor\": \"28\",\n  \"gitVersion\": \"v1.28.2\",\n  \"platform\": \"linux/amd64\"\n}",
            tip: "Provando conectividade direta com o Kube-Apiserver via HTTP local."
          },
          {
            num: 5,
            instruction: "Consulte o nome do Pod criado dinamicamente usando go-template e exiba na tela.",
            command: "kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{\"\\n\"}}{{end}}'",
            expectedOutput: "kubernetes-bootcamp-57978f5f5d-kx982",
            tip: "Esse nome único identifica a instância atômica do Pod agendada no cluster."
          }
        ]
      },
      quiz: [
        {
          question: "Qual é a responsabilidade central de um Deployment Controller no Kubernetes?",
          answers: [
            { text: "Apenas executar um container uma única vez e encerrar imediatamente.", isCorrect: false, note: "Isso seria o papel de um Job pontual." },
            { text: "Manter ativamente o estado desejado da aplicação e substituir instâncias que falham (self-healing).", isCorrect: true, note: "Perfeito! O Deployment garante que o número exato de réplicas saudáveis esteja sempre ativo." },
            { text: "Compilar o código-fonte Java ou NodeJS dentro da máquina virtual.", isCorrect: false, note: "A compilação ocorre na esteira de CI ou Docker build, antes do deploy." }
          ]
        },
        {
          question: "Por padrão, pods recém-criados no cluster podem ser acessados diretamente pela internet?",
          answers: [
            { text: "Sim, qualquer pod criado recebe automaticamente um IP público de internet.", isCorrect: false, note: "Incorreto! Pods residem em uma rede interna isolada do cluster." },
            { text: "Não, eles residem em uma rede privada isolada e exigem Services ou proxies para exposição.", isCorrect: true, note: "Correto! Pods possuem apenas IPs internos efêmeros na rede do cluster." },
            { text: "Sim, desde que a porta 8080 esteja descrita no containerPort.", isCorrect: false, note: "O containerPort apenas documenta a porta, não a expõe para fora do cluster." }
          ]
        }
      ]
    },

    {
      id: 3,
      title: "3. Explorando a Aplicação & Troubleshooting",
      subtitle: "Pods Atômicos, Regra de Acoplamento, Logs e Exec",
      badgeId: "badge-troubleshoot",
      duration: "20 min",
      xpTotal: 500,
      theory: `
        <h3>A Atomicidade do Pod</h3>
        <p>No Kubernetes, você nunca implanta containers individuais. A unidade atômica básica de agendamento é o <strong>Pod</strong>.</p>
        <p>Um Pod encapsula um ou mais containers que compartilham:</p>
        <ul>
          <li><strong>Espaço de Rede Único</strong>: Mesmo IP interno no cluster e mesmo espaço de portas. Containers dentro do mesmo Pod comunicam-se via <code>localhost</code>!</li>
          <li><strong>Volumes Compartilhados</strong>: Podem montar os mesmos diretórios de disco para leitura e escrita conjunta.</li>
          <li><strong>Co-agendamento</strong>: Containers do mesmo Pod sempre nascem e morrem na mesma máquina trabalhadora (Node).</li>
        </ul>

        <div class="callout callout-danger">
          <strong>Critério Rígido de Acoplamento:</strong> Múltiplos containers só devem residir no mesmo Pod se forem estritamente acoplados (padrões <em>Sidecar</em> para coleta de logs, <em>Adapter</em> ou <em>Init Containers</em>). Se forem componentes independentes (ex: Frontend e Banco de Dados), DEVEM ser Pods separados!
        </div>

        <h3>Quarteto Fundamental do Troubleshooting</h3>
        <ol>
          <li><code>kubectl get pods -o wide</code>: Lista status e nó alocado.</li>
          <li><code>kubectl describe pod &lt;nome&gt;</code>: Mostra a tabela <strong>Events</strong> com a causa-raiz de falhas.</li>
          <li><code>kubectl logs &lt;nome&gt;</code>: Exibe a saída STDOUT/STDERR da aplicação.</li>
          <li><code>kubectl exec -ti &lt;nome&gt; -- &lt;comando&gt;</code>: Executa comandos ou abre terminal dentro do container.</li>
        </ol>
      `,
      lab: {
        title: "Laboratório Prático: Diagnóstico Avançado com Describe, Logs e Exec",
        steps: [
          {
            num: 1,
            instruction: "Liste os Pods com detalhes adicionais de IP e Nó onde foram agendados (-o wide).",
            command: "kubectl get pods -o wide",
            expectedOutput: "NAME                                   READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES\nkubernetes-bootcamp-57978f5f5d-kx982   1/1     Running   0          2m    10.244.0.5   minikube   <none>           <none>",
            tip: "Veja o IP privado (10.244.0.5) atribuído exclusivamente a este Pod."
          },
          {
            num: 2,
            instruction: "Inspecione os detalhes completos do Pod, portas, imagens e a seção crucial de 'Events'.",
            command: "kubectl describe pod kubernetes-bootcamp-57978f5f5d-kx982",
            expectedOutput: "Name:             kubernetes-bootcamp-57978f5f5d-kx982\nNamespace:        default\nNode:             minikube/192.168.49.2\nStatus:           Running\nIP:               10.244.0.5\nContainers:\n  kubernetes-bootcamp:\n    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1\n    Port:           8080/TCP\nEvents:\n  Type    Reason     Age   From               Message\n  ----    ------     ----  ----               -------\n  Normal  Scheduled  5m    default-scheduler  Pod alocado com sucesso no nó minikube\n  Normal  Pulled     5m    kubelet            Imagem \"gcr.io/google-samples/kubernetes-bootcamp:v1\" baixada com sucesso\n  Normal  Created    5m    kubelet            Container kubernetes-bootcamp criado\n  Normal  Started    5m    kubelet            Container kubernetes-bootcamp iniciado e ativo",
            tip: "A seção Events revela na hora se faltou memória, se a imagem não existe ou se houve falha de montagem."
          },
          {
            num: 3,
            instruction: "Capture e analise os logs da aplicação gerados em STDOUT.",
            command: "kubectl logs kubernetes-bootcamp-57978f5f5d-kx982",
            expectedOutput: "Aplicação Kubernetes Bootcamp Iniciada!\nServidor ouvindo conexões na porta 8080...\nTempo em atividade: 320 segundos | Total de Requisições: 12",
            tip: "Tudo o que a aplicação imprime no console é capturado nativamente pelo Docker/Kubelet."
          },
          {
            num: 4,
            instruction: "Execute o comando 'env' dentro do container do Pod para inspecionar variáveis de ambiente.",
            command: "kubectl exec kubernetes-bootcamp-57978f5f5d-kx982 -- env",
            expectedOutput: "KUBERNETES_SERVICE_PORT=443\nKUBERNETES_PORT=tcp://10.96.0.1:443\nHOSTNAME=kubernetes-bootcamp-57978f5f5d-kx982\nNODE_VERSION=14.17.0\nHOME=/root\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            tip: "O Kubernetes injeta automaticamente variáveis com os dados do cluster no container."
          },
          {
            num: 5,
            instruction: "Teste a conectividade HTTP interna fazendo um curl para localhost:8080 de dentro do próprio Pod.",
            command: "kubectl exec -ti kubernetes-bootcamp-57978f5f5d-kx982 -- curl localhost:8080",
            expectedOutput: "Olá do Kubernetes Bootcamp! | Rodando no Pod: kubernetes-bootcamp-57978f5f5d-kx982 | Versão da App: v=1",
            tip: "Isso confirma que o servidor web da aplicação está respondendo com sucesso internamente."
          }
        ]
      },
      quiz: [
        {
          question: "Containers que residem dentro do mesmo Pod se comunicam entre si através de qual interface?",
          answers: [
            { text: "Apenas por requisições HTTP direcionadas à internet pública.", isCorrect: false, note: "Eles não precisam passar pela internet." },
            { text: "Através de localhost, compartilhando o mesmo espaço de rede e portas.", isCorrect: true, note: "Exato! Pods compartilham o mesmo Network Namespace e portas." },
            { text: "Eles não podem se comunicar em hipótese alguma.", isCorrect: false, note: "Eles podem e devem compartilhar recursos quando estritamente acoplados." }
          ]
        },
        {
          question: "Ao investigar um Pod que não sobe (Pending ou CrashLoopBackOff), qual seção do 'kubectl describe' fornece a causa-raiz imediata?",
          answers: [
            { text: "Seção de Annotations.", isCorrect: false, note: "Annotations guardam metadados não identificadores." },
            { text: "Seção de Events no final da saída.", isCorrect: true, note: "Isso! A tabela de Events lista os avisos e erros gerados pelo scheduler e kubelet." },
            { text: "Apenas o campo de UID.", isCorrect: false, note: "UID é apenas o hash identificador único do objeto." }
          ]
        }
      ]
    },

    {
      id: 4,
      title: "4. Expondo Aplicações Publicamente (Services & Labels)",
      subtitle: "ClusterIP, NodePort, LoadBalancer e Label Selectors",
      badgeId: "badge-service",
      duration: "20 min",
      xpTotal: 550,
      theory: `
        <h3>A Efemeridade dos IPs de Pods</h3>
        <p>Os IPs dos Pods mudam toda vez que um Pod é recriado ou atualizado. Depender de IPs diretos quebraria qualquer aplicação em produção. A solução é a abstração via <strong>Service</strong>.</p>

        <h3>O que é um Service?</h3>
        <p>Um Service é uma abstração que define um conjunto lógico de Pods e uma política de acesso a eles. Ele provê:</p>
        <ul>
          <li><strong>ClusterIP Estável</strong>: Endereço IP fixo interno que nunca muda durante o ciclo de vida do serviço.</li>
          <li><strong>DNS Interno</strong>: Acessível pelo nome <code>meu-servico.meu-namespace.svc.cluster.local</code>.</li>
          <li><strong>Balanceamento de Carga</strong>: Roteia o tráfego de forma distribuída para todos os Pods saudáveis associados.</li>
        </ul>

        <h3>Tipos Canônicos de Services</h3>
        <ul>
          <li><strong>ClusterIP (Padrão)</strong>: Exposição restrita ao tráfego interno do cluster.</li>
          <li><strong>NodePort</strong>: Abre uma porta estática (faixa 30000-32767) em TODOS os nós do cluster, permitindo acesso externo via <code>&lt;NodeIP&gt;:&lt;NodePort&gt;</code>.</li>
          <li><strong>LoadBalancer</strong>: Provisiona um balanceador externo oficial em provedores cloud (AWS, GCP, Azure, OCI) com IP público dedicado.</li>
        </ul>

        <h3>Labels e Label Selectors: A Conexão Vital</h3>
        <p>A ligação entre Deployments, Pods e Services é feita exclusivamente por <strong>Labels</strong> (etiquetas chave/valor) e <strong>Label Selectors</strong>. O Service monitora ativamente as labels dos Pods e preenche o recurso <code>Endpoints</code> apenas com réplicas prontas.</p>
      `,
      lab: {
        title: "Laboratório Prático: Criando Service NodePort e Manipulando Labels",
        steps: [
          {
            num: 1,
            instruction: "Exponha o Deployment 'kubernetes-bootcamp' externamente criando um Service do tipo NodePort na porta 8080.",
            command: "kubectl expose deployment/kubernetes-bootcamp --type=\"NodePort\" --port 8080",
            expectedOutput: "service/kubernetes-bootcamp exposto com sucesso",
            tip: "O K8s aloca uma porta acima de 30000 em todos os nós apontando para o Pod."
          },
          {
            num: 2,
            instruction: "Liste os serviços ativos no cluster para verificar o ClusterIP e a porta NodePort alocada.",
            command: "kubectl get services",
            expectedOutput: "NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE\nkubernetes            ClusterIP   10.96.0.1        <none>        443/TCP          25m\nkubernetes-bootcamp   NodePort    10.105.120.44    <none>        8080:31456/TCP   1m",
            tip: "Veja que o serviço recebeu a porta 31456 mapeada para a porta interna 8080."
          },
          {
            num: 3,
            instruction: "Exiba os detalhes do Service e confirme que o Endpoint está apontando para o IP do seu Pod.",
            command: "kubectl describe service kubernetes-bootcamp",
            expectedOutput: "Name:                     kubernetes-bootcamp\nNamespace:                default\nLabels:                   app=kubernetes-bootcamp\nSelector:                 app=kubernetes-bootcamp\nType:                     NodePort\nIP:                       10.105.120.44\nPort:                     <unset>  8080/TCP\nTargetPort:               8080/TCP\nNodePort:                 <unset>  31456/TCP\nEndpoints:                10.244.0.5:8080",
            tip: "Endpoints confirma que o Service encontrou o Pod usando o selector 'app=kubernetes-bootcamp'."
          },
          {
            num: 4,
            instruction: "Simule uma chamada externa ao NodePort usando o IP do Minikube.",
            command: "curl 192.168.49.2:31456",
            expectedOutput: "Olá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-57978f5f5d-kx982 | Versão: v=1",
            tip: "A aplicação foi acessada com sucesso de fora do cluster via NodePort!"
          },
          {
            num: 5,
            instruction: "Aplique uma nova Label 'tier=frontend' diretamente ao seu Pod.",
            command: "kubectl label pods kubernetes-bootcamp-57978f5f5d-kx982 tier=frontend",
            expectedOutput: "pod/kubernetes-bootcamp-57978f5f5d-kx982 rotulado com sucesso",
            tip: "Labels permitem criar filtros avançados e organizar recursos por ambiente, tier ou versão."
          },
          {
            num: 6,
            instruction: "Filtre os Pods consultando especificamente pela nova label adicionada.",
            command: "kubectl get pods -l tier=frontend",
            expectedOutput: "NAME                                   READY   STATUS    RESTARTS   AGE\nkubernetes-bootcamp-57978f5f5d-kx982   1/1     Running   0          6m",
            tip: "O seletor -l filtrou exatamente o pod que recebeu a etiqueta informada."
          }
        ]
      },
      quiz: [
        {
          question: "Qual tipo de Service é mais recomendado para comunicação restrita entre microsserviços internos?",
          answers: [
            { text: "NodePort", isCorrect: false, note: "NodePort abre portas desnecessárias em todos os nós." },
            { text: "ClusterIP", isCorrect: true, note: "Perfeito! ClusterIP é o padrão seguro para tráfego estritamente interno." },
            { text: "LoadBalancer", isCorrect: false, note: "LoadBalancer provisiona IPs públicos com custo adicional na nuvem." }
          ]
        },
        {
          question: "Se você excluir um Service (kubectl delete service), o que acontece com a aplicação e seus Pods?",
          answers: [
            { text: "Todos os Pods são destruídos imediatamente junto com o Service.", isCorrect: false, note: "Incorreto! Quem gerencia os Pods é o Deployment, não o Service." },
            { text: "Apenas a rota de acesso e balanceamento é removida; os Pods continuam rodando intactos.", isCorrect: true, note: "Correto! O ciclo de vida do Service é desacoplado do Deployment." },
            { text: "O nó inteiro entra em estado de drenagem.", isCorrect: false, note: "Não há relação com a saúde dos nós físicos." }
          ]
        }
      ]
    },

    {
      id: 5,
      title: "5. Escalonamento Horizontal (Scaling)",
      subtitle: "ReplicaSets, Estados de Réplicas e Balanceamento de Carga",
      badgeId: "badge-scale",
      duration: "15 min",
      xpTotal: 600,
      theory: `
        <h3>O que é Scaling Horizontal?</h3>
        <p>Quando o tráfego da sua aplicação aumenta, você precisa de mais instâncias para suportar a demanda. No Kubernetes, o escalonamento horizontal de aplicações stateless é realizado alterando o número de <strong>réplicas</strong> no Deployment.</p>

        <h3>O Papel do ReplicaSet</h3>
        <p>Ao criar um Deployment, ele cria e gerencia internamente um <strong>ReplicaSet</strong> (com nome <code>&lt;deployment-name&gt;-&lt;hash&gt;</code>). O ReplicaSet é o operador encarregado de criar, manter ou finalizar as réplicas necessárias para satisfazer a contagem desejada.</p>

        <h3>Os 4 Estados de Réplicas</h3>
        <ul>
          <li><strong>DESIRED</strong>: O número de instâncias configurado no manifesto.</li>
          <li><strong>CURRENT</strong>: Quantidade de réplicas em execução/tentativa no momento.</li>
          <li><strong>UP-TO-DATE</strong>: Réplicas que já foram atualizadas para o template mais recente.</li>
          <li><strong>AVAILABLE</strong>: Réplicas saudáveis que passaram nas checagens de prontidão e estão aptas a receber tráfego de usuários.</li>
        </ul>

        <h3>Balanceamento Dinâmico via Service</h3>
        <p>O Service monitora continuamente os Pods através do objeto <strong>Endpoints</strong>. Quando novas réplicas ficam prontas, elas entram imediatamente no pool de balanceamento. Quando o Deployment é reduzido (scale down), os pods excedentes são finalizados graciosamente e removidos dos endpoints sem interrupção de conexões ativas.</p>
      `,
      lab: {
        title: "Laboratório Prático: Escalando para 4 Réplicas e Testando Balanceamento",
        steps: [
          {
            num: 1,
            instruction: "Exiba os ReplicaSets do cluster para inspecionar o controlador subjacente ao seu Deployment.",
            command: "kubectl get rs",
            expectedOutput: "NAME                             DESIRED   CURRENT   READY   AGE\nkubernetes-bootcamp-57978f5f5d   1         1         1       8m",
            tip: "Observe o hash aleatório gerado a partir do pod-template."
          },
          {
            num: 2,
            instruction: "Escale o Deployment 'kubernetes-bootcamp' para 4 réplicas usando o comando scale.",
            command: "kubectl scale deployment/kubernetes-bootcamp --replicas=4",
            expectedOutput: "deployment.apps/kubernetes-bootcamp escalado para 4 réplicas com sucesso",
            tip: "O controlador imediatamente cria 3 novos pods e agenda nos nós disponíveis."
          },
          {
            num: 3,
            instruction: "Liste os Pods para confirmar que as 4 réplicas estão rodando com IPs distintos.",
            command: "kubectl get pods -o wide",
            expectedOutput: "NAME                                   READY   STATUS             RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES\nkubernetes-bootcamp-57978f5f5d-kx982   1/1     Running            0          2m    10.244.0.5   minikube   <none>           <none>",
            tip: "Agora temos 4 instâncias independentes atendendo requisições."
          },
          {
            num: 4,
            instruction: "Inspecione os Endpoints do Service para comprovar que ele adicionou todos os 4 IPs automaticamente.",
            command: "kubectl describe service kubernetes-bootcamp",
            expectedOutput: "Endpoints: 10.244.0.5:8080,10.244.0.6:8080,10.244.0.7:8080,10.244.0.8:8080",
            tip: "O Endpoint Controller mantém a sincronização em tempo real."
          },
          {
            num: 5,
            instruction: "Execute múltiplas chamadas HTTP consecutivas para verificar o balanceamento de carga (Round-Robin).",
            command: "for i in {1..4}; do curl -s 192.168.49.2:31456; done",
            expectedOutput: "Olá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-57978f5f5d-kx982 | Versão: v=1\nOlá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-57978f5f5d-ab123 | Versão: v=1\nOlá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-57978f5f5d-cd456 | Versão: v=1\nOlá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-57978f5f5d-ef789 | Versão: v=1",
            tip: "Cada requisição atinge um Pod diferente! O balanceamento dinâmico está funcionando."
          },
          {
            num: 6,
            instruction: "Reduza o número de réplicas (Scale Down) para 2.",
            command: "kubectl scale deployment/kubernetes-bootcamp --replicas=2",
            expectedOutput: "deployment.apps/kubernetes-bootcamp escalado para 2 réplicas com sucesso",
            tip: "O Kubernetes encerra 2 pods com terminação graciosa (graceful shutdown)."
          }
        ]
      },
      quiz: [
        {
          question: "Qual componente subjacente gerencia a criação e término direto de pods quando um Deployment é escalado?",
          answers: [
            { text: "Ingress Controller", isCorrect: false, note: "Ingress cuida de roteamento HTTP camada 7." },
            { text: "ReplicaSet", isCorrect: true, note: "Exatamente! O ReplicaSet garante o número desejado de réplicas de Pods." },
            { text: "Kube-dns", isCorrect: false, note: "Kube-dns é responsável por resolução de nomes internos." }
          ]
        },
        {
          question: "O que acontece se você escalar um Deployment para zero réplicas (--replicas=0)?",
          answers: [
            { text: "O Deployment e o Service são apagados permanentemente do cluster.", isCorrect: false, note: "Não são apagados, as definições continuam preservadas." },
            { text: "Todos os pods são encerrados graciosamente, mas o Deployment e o Service continuam existindo sem consumir CPU/RAM.", isCorrect: true, note: "Excelente! Esse é o padrão scale-to-zero, muito útil para economia de recursos." },
            { text: "O comando dá erro, pois o mínimo de réplicas permitido é 1.", isCorrect: false, note: "Zero é um valor plenamente suportado no Kubernetes." }
          ]
        }
      ]
    },

    {
      id: 6,
      title: "6. Rolling Updates e Rollbacks com Zero Downtime",
      subtitle: "Atualização Incremental de Imagens, MaxSurge, Falhas e Undo",
      badgeId: "badge-rolling",
      duration: "20 min",
      xpTotal: 700,
      theory: `
        <h3>O Desafio das Atualizações em Produção</h3>
        <p>Aplicações modernas precisam ser atualizadas dezenas de vezes ao dia sem qualquer indisponibilidade (zero downtime) para os clientes. No Kubernetes, isso é alcançado nativamente através dos <strong>Rolling Updates</strong>.</p>

        <h3>Como Funciona o Rolling Update</h3>
        <p>Em vez de derrubar todas as instâncias antigas de uma vez, o Deployment:</p>
        <ol>
          <li>Cria um novo Pod com a versão atualizada da imagem.</li>
          <li>Aguarda esse novo Pod passar nos testes de prontidão (Readiness Probe) e ficar <code>Ready</code>.</li>
          <li>Adiciona o novo Pod aos Endpoints do Service para começar a receber tráfego.</li>
          <li>Drena conexões e finaliza um Pod da versão antiga.</li>
          <li>Repete o ciclo até que 100% dos Pods estejam na nova versão.</li>
        </ol>

        <div class="callout callout-info">
          <strong>Controle de Ritmo:</strong> Controlado por <code>maxSurge</code> (quantos pods extras podem ser criados além do desejado) e <code>maxUnavailable</code> (quantos pods podem ficar temporariamente fora do ar durante a troca).
        </div>

        <h3>Tratamento de Falhas e Rollback Imediato</h3>
        <p>Se a nova imagem não existir (<code>ImagePullBackOff</code>) ou quebrar ao iniciar (<code>CrashLoopBackOff</code>), o Kubernetes pausa a substituição, mantendo os pods antigos ativos atendendo o tráfego. Com um único comando (<code>kubectl rollout undo</code>), é possível reverter instantaneamente para a versão estável anterior!</p>
      `,
      lab: {
        title: "Laboratório Prático: Atualização para v2, Simulação de Falha v10 e Rollback",
        steps: [
          {
            num: 1,
            instruction: "Verifique a imagem atualmente em uso nos Pods do Deployment.",
            command: "kubectl describe pods | grep Image:",
            expectedOutput: "    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1\n    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1",
            tip: "Todos os pods estão rodando a versão 1."
          },
          {
            num: 2,
            instruction: "Inicie o Rolling Update atualizando a imagem do container para a versão v2.",
            command: "kubectl set image deployment/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2",
            expectedOutput: "deployment.apps/kubernetes-bootcamp imagem atualizada para versão v2 com sucesso",
            tip: "O Deployment iniciou a criação incremental dos pods v2."
          },
          {
            num: 3,
            instruction: "Acompanhe o status da atualização em tempo real até a conclusão com rollout status.",
            command: "kubectl rollout status deployment/kubernetes-bootcamp",
            expectedOutput: "deployment \"kubernetes-bootcamp\" atualizado com sucesso (rollout concluído sem indisponibilidade)",
            tip: "Zero downtime! A transição ocorreu sem que a aplicação ficasse fora do ar."
          },
          {
            num: 4,
            instruction: "Faça uma requisição ao serviço para confirmar que ele agora responde na versão v2.",
            command: "curl 192.168.49.2:31456",
            expectedOutput: "Olá do Kubernetes Bootcamp! | Atendido pelo Pod: kubernetes-bootcamp-6b877fffc7-z89wq | Versão: v=2",
            tip: "A versão v2 está ativa e respondendo com sucesso!"
          },
          {
            num: 5,
            instruction: "Simule uma falha grave tentando atualizar para uma tag inexistente 'v10'.",
            command: "kubectl set image deployment/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10",
            expectedOutput: "deployment.apps/kubernetes-bootcamp imagem atualizada (Aguardando conclusão do rollout...)",
            tip: "A imagem não existe no repositório remoto."
          },
          {
            num: 6,
            instruction: "Verifique os Pods para observar o erro de 'ImagePullBackOff'.",
            command: "kubectl get pods",
            expectedOutput: "NAME                                   READY   STATUS             RESTARTS   AGE\nkubernetes-bootcamp-6b877fffc7-z89wq   1/1     Running            0          3m\nkubernetes-bootcamp-7c989b5c89-fail1   0/1     ImagePullBackOff   0          25s",
            tip: "Observe que os Pods v2 continuam funcionando e atendendo os usuários normalmente!"
          },
          {
            num: 7,
            instruction: "Execute o Rollback imediato revertendo o Deployment para a última versão estável.",
            command: "kubectl rollout undo deployment/kubernetes-bootcamp",
            expectedOutput: "deployment.apps/kubernetes-bootcamp revertido com sucesso para a revisão anterior estável",
            tip: "O Kubernetes cancela a tentativa falha e restaura a saúde do cluster."
          },
          {
            num: 8,
            instruction: "Confirme que o rollout voltou para a versão estável v2 e todos os pods estão saudáveis.",
            command: "kubectl rollout status deployment/kubernetes-bootcamp",
            expectedOutput: "deployment \"kubernetes-bootcamp\" atualizado com sucesso (rollout concluído sem indisponibilidade)",
            tip: "Excelente! Rollback concluído com sucesso e nenhuma perda de disponibilidade."
          }
        ]
      },
      quiz: [
        {
          question: "Qual é o comportamento do Service durante um Rolling Update se uma das novas réplicas falhar ao iniciar?",
          answers: [
            { text: "O Service derruba todo o tráfego do site e entra em pane geral.", isCorrect: false, note: "O Service possui proteções contra isso." },
            { text: "O Service continua roteando tráfego exclusivamente para os Pods antigos que continuam saudáveis (AVAILABLE).", isCorrect: true, note: "Perfeito! Apenas instâncias saudáveis recebem tráfego." },
            { text: "Ele começa a enviar 50% dos usuários para o pod com erro.", isCorrect: false, note: "Pods que não estão Ready/Available nunca entram nos Endpoints." }
          ]
        },
        {
          question: "Qual comando do Kubectl desfaz imediatamente uma atualização defeituosa e restaura a revisão anterior?",
          answers: [
            { text: "kubectl rollout undo deployment/<nome>", isCorrect: true, note: "Correto! Esse comando desfaz o rollout voltando à versão estável anterior." },
            { text: "kubectl reset deployment", isCorrect: false, note: "Esse comando não existe no Kubectl." },
            { text: "kubectl delete cluster", isCorrect: false, note: "Deletar o cluster destruiria todo o ambiente!" }
          ]
        }
      ]
    },

    {
      id: 7,
      title: "7. Bônus: Configurações & Segredos (12-Factor App)",
      subtitle: "ConfigMaps, Secrets, Injeção de Variáveis e Desacoplamento",
      badgeId: "badge-secrets",
      duration: "15 min",
      xpTotal: 500,
      theory: `
        <h3>Princípio do Desacoplamento (12-Factor App)</h3>
        <p>Uma imagem de container nunca deve conter senhas, tokens de banco ou URLs fixas gravadas dentro do código. A imagem deve ser <strong>imutável</strong> e reutilizável em qualquer ambiente (dev, homologação ou produção).</p>
        
        <h3>ConfigMaps vs Secrets</h3>
        <ul>
          <li><strong>ConfigMap</strong>: Armazena dados de configuração não-sensíveis (portas, nomes de serviços, URLs de APIs, flags de feature). Pode ser criado a partir de literais, arquivos ou diretórios.</li>
          <li><strong>Secret</strong>: Armazena informações confidenciais (senhas, certificados SSL/TLS, chaves de API, credenciais de registries de imagem). Valores são codificados em Base64 para prevenir visualização acidental em logs e telas.</li>
        </ul>

        <h3>Injeção em Workloads</h3>
        <p>Ambos podem ser injetados em Pods através de:</p>
        <ol>
          <li><strong>Variáveis de Ambiente</strong>: Usando <code>valueFrom.configMapKeyRef</code> ou <code>valueFrom.secretKeyRef</code>.</li>
          <li><strong>Volumes de Arquivos</strong>: Montando o ConfigMap ou Secret como arquivos dentro de diretórios do container (ideal para arquivos como <code>nginx.conf</code> ou certificados).</li>
        </ol>
      `,
      lab: {
        title: "Laboratório Prático: Criando ConfigMap e Secret e Injetando na Aplicação",
        steps: [
          {
            num: 1,
            instruction: "Crie um ConfigMap chamado 'app-config' com a chave 'APP_NAME=meu-sistema-k8s'.",
            command: "kubectl create configmap app-config --from-literal=APP_NAME=meu-sistema-k8s",
            expectedOutput: "configmap/app-config criado com sucesso",
            tip: "O ConfigMap desacopla variáveis de ambiente do container."
          },
          {
            num: 2,
            instruction: "Inspecione o ConfigMap criado e confira o par chave/valor gravado.",
            command: "kubectl describe configmap app-config",
            expectedOutput: "Name:         app-config\nNamespace:    default\nData\n====\nAPP_NAME:\n----\nmeu-sistema-k8s",
            tip: "Os dados ficam armazenados de forma limpa e legível."
          },
          {
            num: 3,
            instruction: "Crie um Secret genérico chamado 'db-credentials' contendo usuário e senha segura.",
            command: "kubectl create secret generic db-credentials --from-literal=username=admin --from-literal=password=SuperSecretK8sPwd",
            expectedOutput: "secret/db-credentials criado com sucesso",
            tip: "Secrets são voltados para dados sensíveis e credenciais."
          },
          {
            num: 4,
            instruction: "Consulte o Secret e observe que os valores não são exibidos em texto puro sem comando específico.",
            command: "kubectl get secret db-credentials -o yaml",
            expectedOutput: "apiVersion: v1\ndata:\n  password: U3VwZXJTZWNyZXRLOHNQd2Q=\n  username: YWRtaW4=\nkind: Secret\nmetadata:\n  name: db-credentials",
            tip: "Os dados são ofuscados em Base64 no manifesto para segurança."
          }
        ]
      },
      quiz: [
        {
          question: "Qual é a principal diferença de propósito entre um ConfigMap e um Secret no Kubernetes?",
          answers: [
            { text: "ConfigMaps são para dados sensíveis como senhas; Secrets são para portas e URLs abertas.", isCorrect: false, note: "É exatamente o oposto!" },
            { text: "ConfigMaps são para dados não-sensíveis de configuração; Secrets são especializados em dados confidenciais e credenciais.", isCorrect: true, note: "Exato! Essa separação garante governança e segurança em esteiras DevSecOps." },
            { text: "Não há nenhuma diferença prática, apenas o nome muda.", isCorrect: false, note: "Há diferenças cruciais de segurança, RBAC e ofuscação." }
          ]
        },
        {
          question: "Qual é o método canônico de injetar um Secret como variável de ambiente em um manifesto de Pod?",
          answers: [
            { text: "Gravar a senha diretamente no Dockerfile com a instrução ENV.", isCorrect: false, note: "Nunca faça isso! A senha ficaria visível em qualquer camada da imagem." },
            { text: "Utilizar o bloco env com valueFrom e secretKeyRef.", isCorrect: true, note: "Perfeito! O K8s injeta o valor em runtime sem expor no código." },
            { text: "Enviar a senha via parâmetro de linha de comando no entrypoint.", isCorrect: false, note: "Processos no SO expõem argumentos em comandos ps." }
          ]
        }
      ]
    }
  ]
};
