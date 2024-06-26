# Springboot笔记

## 一、简介与特性

+ Springboot是Spring官方提供的可以帮我们简单、快速地创建一个独立的、生产级别的 Spring 应用
+ SpringBoot可以:
  + 快速创建独立的Spring应用
  + 直接嵌入Tomcat、Jetty or Undertow（无需部署 war 包）(Servlet容器):如果是jar包可以通过`java -jar`命令运行，当然war包也可以，但建议war包放到tomcact的webapps目录内运行
  + 提供可选的starter，简化应用整合:**SpringBoot提供了许多场景启动器，并为每种场景准备了对应依赖，且自动为我们导入了符合当前版本的包**
  + 按需自动配置 Spring 以及 第三方库:**SpringBoot遵循约定大于配置的原则，它的每个场景都有很多默认配置**，如果我们想自定义，只需要修改几项即可
  + 提供生产级特性：如 监控指标、健康检查、外部化配置等
  + 无代码生成、无xml
+ 总结：SpringBoot可以简化开发，简化配置，简化整合，简化部署，简化监控，简化运维
  + **简化整合**:我们想实现什么功能，就导入什么场景。
    + 官方提供的场景一般叫`spring-boot-starter-*`，而第三方提供的场景一般叫`*-spring-boot-starter`
    + [默认支持的场景](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)
  + **简化开发**:无需进行任何配置，直接就可以开始开发
  + **简化配置**:SpringBoot的约定大于配置
    + 它提供了许多默认的配置，这样就不用我们在每次开始开发的时候先进行大量的配置工作
    + 如果想更改配置，可以创建一个`application.properties`文件，所有的配置都写在该文件中修改即可
    + [可修改的配置](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)
  + **简化部署**:打包为可执行的jar包，只需要linux系统上有java环境即可
  + **简化运维**:可以快速地修改配置（通过application.properties）、监控、健康检测

---

## 二、使用

### （一）HelloWorld

+ 首先需要创建一个项目，在项目内指定该项目继承自spring-boot-starter-parent

~~~xml

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.5</version>
        <!-- 
          该标签的作用是Maven在查找依赖时先从该标签指定的本地路径下（这个本地路径不是仓库路径，而是父项目的pom.xml路径）查找，找不到再找本地仓库，找不到再找全局仓库
          但是不写IDEA（比较老的版本可能不报）可能会报错
          将该标签设置为空体可以使Maven直接从本地仓库中寻找依赖项，就直接绕过了本地路径
         -->
        <relativePath/>
    </parent>

~~~

+ 接下来指定依赖项:

~~~xml

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

~~~

+ 接下来开始编写Application类，该类是整个SpringBoot项目的启动类:

~~~java
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    @SpringBootApplication  // 该注解用来声明这是SpringBoot的项目启动类
    public class MainApplication {
        public static void main(String[] args) {
            // 调用SpringApplication的run方法，传入本类的Class对象和参数来启动SpringBoot项目
            // 这是固定写法
            SpringApplication.run(MainApplication.class,args);
        }
    }

~~~

+ 启动main方法便可以开始运行了
+ SpringBoot内置了对应的tomcat,因此我们无需再配置，它的默认端口为8080,通过访问可以发现它返回了404:

![SpringBoot启动](../../文件/图片/SpringBoot图片/SpringBoot启动.png)

+ 这是因为我们一个controller都没写，没有接受任何请求
+ 接下来创建controller类:

~~~java
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController  // @ResponseBody+@Controller
    @RequestMapping("/index")  // 匹配映射/index访问
    public class HelloSpringBootController {
        @GetMapping
        public String helloSpringBoot(){
            return "Hello SpringBoot3";
        }
    }
~~~

+ 接下来就能访问了，直接访问[指定路径](http://localhost:8080/index)来测试是否正确配置
<br>

+ 除此以外，SpringBoot还额外提供了插件，供我们通过命令行的方式直接运行该jar包或war包
  + 首先执行`mvn clean package`重新打包
  + 接下来在所在包的对应目录下打开cmd,执行`java -jar xxxx.jar/war`来运行
  + 访问路径确认是否项目已经运行
<br>
<br>

+ 由于SpringBoot为了简化配置，它自动的配置了很多默认配置项
+ 如果我们想修改，我们可以在对应jar包或war包的同级目录下新建一个叫`application.properties`的配置文件，在该配置文件内指定自定义配置:

~~~properties
    <!-- 这里指定端口号为8888 -->
    server.port=8888
~~~

---

### （二）构建项目

#### ①手动构建

+ 这种创建方式可以创建老版本的SpringBoot项目
+ 首先创建一个普通的Java项目:
![构建项目图例1](../../文件/图片/SpringBoot图片/构建项目图例1.png)
+ 然后在pom.xml文件内指定项目的父项目为SpringBoot项目，并指定继承的父项目版本:
  + 还可以指定子项目的版本

~~~xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <version>0.0.1-SNAPSHOT</version>  <!-- 指定子项目版本，可选 -->
~~~

+ 接下来添加依赖:
  + 一般就添加一个spring-boot-starter-web依赖就行:

~~~xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
~~~

+ 添加完之后，会发现出现了一个小选项:

![构建项目图例2](../../文件/图片/SpringBoot图片/构建项目图例2.png)

+ 点击该选项，就可以选择SpringBoot帮我们整合好的依赖了:

![构建项目图例3](../../文件/图片/SpringBoot图片/构建项目图例3.png)

+ 接下来在resources目录下创建一个application.properties或application.yml配置文件
+ 根据本项目的artifactid在java目录下创建包，再写一个Application启动类，加上@SpringBootApplication注解，尝试启动。如果成功，此时我们的项目就构建完了
+ 但是，会出现两个问题
  1. 右边的Maven选项中，并未显示我们新创建的项目。**这意味着我们只能通过命令行的方式对项目进行Maven操作，也无法便捷的查看依赖**
  2. 我们的项目编译之后，放到了父项目的out目录下，而不是放到了自己模块的target目录下。**这会导致一些情况下的ClassNotFound异常**
+ 因此，我们需要解决这两个问题
  + 问题1:首先打开我们父项目的pom.xml文件，会发现一个modules标签，**我们创建的项目存在于该标签内，删掉它，然后刷新Maven**。该问题的原因是idea认为我们创建的项目是该项目的子项目，因为我们并没有以`Spring Initializr`模块的方式创建，于是它自动就把我们的项目归为了上层项目的子模块了
    + **解决该问题后，idea可能会在其右下角弹出一个load maven project的选项，如果有，直接选上，这样下面的问题2也会被同步解决**
  + 问题2:右键项目->Open Module Steeings->Modules->我们新创建的项目->选择target目录->取消右上角的Excluded选项

![构建项目图例4](../../文件/图片/SpringBoot图片/构建项目图例5.png)

---

#### ②自动构建

+ IDEA提供了自动创建SpringBoot项目的模板模块:SpringInitializr，他可以为我们快速创建一个对应的SpringBoot项目
+ 首先new->Module，在左边的目录选择SpringInitializr

![创建项目](../../文件/图片/SpringBoot图片/SpringInitializr创建项目1.png)

+ Name后写项目名称
+ Type选择Maven
+ Group自己指定一个对应的Group
+ JDK推荐选择17及以上
+ 打包方式随便
+ 接下来点击Next,进到选择场景界面

![创建项目2](../../文件/图片/SpringBoot图片/SpringInitializr创建项目2.png)

+ 在此界面的左上角可以选择SpringBoot的对应版本
+ 下面的Depemdencies下可以选择对应的场景:
  + 一般都是写JavaWeb项目，所以需要勾选Web下的SpringWeb
  + 如果想使用数据库，在SQL选择JDBC API和MySQL Driver，还可以选择Mybatis Framework
  + 如果想使用与jsp相关的视图解析器，可以在Template Engines下选择Thymleaf
  + 如果想使用Lombok，在Developers Tools下选择Lombok
+ 选择好之后点击创建，IDEA会**自动导入相关依赖**并**创建好相对应的项目启动类**
+ 如果我们想编写业务代码，我们需要把我们的代码及它们所在包写在项目启动类所在包的子包或后代包下，因为**SpringBoot默认只会扫描项目启动类所在包的子包及后代包的类**
+ 我们只需要指定基本的配置就行，它就会自动为我们创建好
+ 该自动构建的方式，由于是依靠`start.spring.io`的项目模型来构建的，因此其版本也会随着该网站的更新而更新。该网站是spring官方提供的自动构建项目的网站，它仅会提供最新的几个SpringBoot项目模板，**如果想使用老版本的SpringBoot，可以自己手动构建，也可以替换构建项目的url，把它换成`https://start.aliyun.com/`**

---

### （三）依赖管理

+ SpringBoot容易使用，其中的原因之一就是依靠依赖管理来实现的
  + 根据Maven的依赖传递原则，A依赖了B，且B依赖了C，那么A同时拥有B和C
    + 根据该情况，我们只需要导入对应的场景，而**SpringBoot提供的对应场景启动器依赖本身已经导入了许多依赖**，这样，当我们想开发什么场景时，就导入指定的场景启动器就可以直接进行开发了，因为这些场景启动器已经导入了我们想导入的依赖
  + 我们在**导入依赖时，不需要写版本号**
    + 这是因为每个SpringBoot项目都有公共的父项目——`spring-boot-starter-parent`，而该项目的父项目又是`spring-boot-dependencies`，它**为我们声明了许多常用依赖的适配版本**
    + 如果我们想改变依赖的版本号，可以依据Maven的就近原则，直接在我们项目的pom.xml文件内的properties标签内声明对应的版本，然后再在denpendency标签内声明版本即可；或者直接在dependency标签内声明版本也可以。由于就近原则，Maven会认定我们手动指定的版本优先级更高
  + 如果我们想导入的依赖没有在我们继承的父项目内，那么我们只能自己导入了（如Druid连接池）

---

### （四）核心

#### ①配置文件

##### Ⅰyaml文件

+ 我们的application.properties文件不能明显的表示层级关系，因此当其配置变多以后，里面的内容会变得难以阅读和维护
+ 为了解决这方面的困境，我们可以提供另外一种配置文件:application.yaml配置文件
  + YAML 是 "YAML Ain't a Markup Language"（YAML 不是一种标记语言）。在开发的这种语言时，YAML 的意思其实是："Yet Another Markup Language"（是另一种标记语言）
  + 该文件层次分明，方便人类读写
+ 它的基本语法很简单
  + 区分大小写
  + 使用缩进表示层级关系
  + 使用`key:(空格)value`的键值对形式表示数据，**value前的空格必须写**
  + 只要两个key的左侧是对齐的，那么它们就是相同层级的
  + #表示注释
  + 不能使用Tab键，只能使用空格
  + **二者的部分配置冲突时，properties文件的优先级比yaml文件的优先级高**
+ 示例:
  + 现在我们想对一个java实体类进行属性注入，我们需要在配置类中配置其属性默认值:

~~~java

@Component
@ConfigurationProperties(prefix = "people")
@Data
public class People {
    private String name;
    private Integer age;
    private Date birthDay;
    private Boolean like;
    private Child child; //嵌套对象
    private List<Dog> dogs; //数组（里面是对象）
    private Map<String,Cat> cats; //表示Map
}

~~~

+ 首先是[使用properties文件进行配置](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/resources/application.properties)
+ 接下来[使用yaml文件进行配置](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/resources/application.yaml)

---

##### Ⅱ复杂对象表示与语法细节

+ 如果我们想使用properties文件表示复杂对象的话:
  + 对于Map对象，就直接写xxx.xxx.key.propertyName=yyy
  + 对于List或数组对象，直接写xxx.xxx.arr[index].propertyName=yyy
+ 如果我们想使用yml文件表示复杂对象:

~~~yml
  xxx:
    yyy: [value1,value2,...] # 表示数组
    zzz: 
      - name: lzx  # 如果是对象数组，直接在- 后面加上属性，然后赋值
      - age: 10
    kkk: {name: ly,age: 20}  # 如果是对象，可以直接用大括号表示
    jjj:
      name: ly  # 或者使用这种方法进行测试
      age: 20
~~~

+ 配置文件还有一些特殊语法:
  + 如果我们的属性名是小驼峰命名法命名的，如birthDay,那么**yml文件或properties文件内都可以写成birth-day**
  + **在properties文件中**，如果一行文本过长，那么可以写一个`\`字符，然后换行接着写
  + 对于文本，一般不需要加引号，就默认是字符串。但是yml文件确实提供了引号:
    + 单引号内的转义字符不会生效
    + 双引号内的转义字符会生效
  + 对于大文本，即多行文本
    + 使用`|`开头，然后将大文本写在其下方，**注意是正下方或右下，不能写的相对于该符号靠左**，它可以保留文本格式，即文本写的是什么样，输出就是什么样
    + 使用`>`开头，然后将大文本写在其下方，**注意是正下方或右下，不能写的相对于该符号靠左**，它会折叠换行符，改为一个空格隔开
  + 还可以使用`---`将多个yml文档合并在一个文档中，每个文档区依然认为内容独立

---

##### Ⅲ优先级

+ SpringBoot接收多个来源的配置，这些配置生效的优先级如下（靠后的配置会覆盖掉靠前的）:
  + 通过SpringApplication对象的setDefaultProperties方法指定的配置
  + 通过@PropertySource注解导入的配置
  + **通过配置文件指定的配置**
  + RandomValuePropertySource支持的random.*配置（如：@Value("${random.int}")）
  + 操作系统的环境变量，**这里注意username是操作系统内用户名的环境变量名**
  + Java 系统属性（System.getProperties()）
  + JNDI 属性（来自java:comp/env）
  + ServletContext 初始化参数
  + ServletConfig 初始化参数
  + SPRING_APPLICATION_JSON属性（内置在环境变量或系统属性中的 JSON）
  + **命令行参数**
  + 测试属性。(@SpringBootTest进行测试时指定的属性)
  + 测试类@TestPropertySource注解导入的配置
  + Devtools 设置的全局属性。($HOME/.config/spring-boot)
+ 这些配置优先级的原理就是靠前的配置被先加载，靠后的配置被后加载，而后加载的配置覆盖掉了先前配置的值。但是**如果导入了多个配置，但是这些配置都不冲突，最终他们都会生效**
+ 在配置文件中，其优先级又可以被细分为:
  + 同级properties文件>yaml文件
  + jar包外的profile文件>jar包外的properties文件>jar包内的profile文件>jar包内的properties文件
  + jar包内的`classpath:/config`目录下的直接子目录内的文件>`classpath:/config`目录下的文件>类根路径下的文件（即深层的>浅层的）

--

#### ②场景处理

+ 在了解完成SpringBoot的自动配置机制后，我们就可以进行基本的场景定制化处理了
  + 首先我们需要导入对应的场景启动器
  + 接下来可以修改配置文件，以达到我们期望的配置
  + 分析该场景向IOC容器内增加了什么组件，这些组件是否能够满足我们的需求
    + 如果满足，我们就可以使用@AutoWired注解自动装配了
    + 如果不满足，我们可以进行定制化
      + 可以看到每个AutoConfiguration类内要加入IOC容器的组件，如果想加入，**它们都有前置条件**
      + 因此只要打破这些前置条件，其自动配置就不会执行
      + 而我们打**破这些前置条件最简单的方法就是我们在自己编写的配置类或其它地方也提供对应的bean**
      + 这样就实现了定制化

---

#### ③自动配置

+ SpringBoot提供了自动配置的服务，让我们能够享受如下的便利:
  + 编写SpringBoot项目时，只需要在application.properties或yaml文件中编写配置就可以对项目进行配置了，非常的方便
  + SpringBoot项目在扫描包时，会**扫描主程序类(就是被@SpringBootApplication注解作用的类)所在包及其后代包**，就不需要我们在配置类中手动指定@ComponentScan注解了
  + 一旦我们导入了场景，启动时运行的run方法在执行过程中会自动将场景的相关组件加入到IOC容器内并配置好，便于我们使用
  + run方法返回ioc容器对象，方便我们使用
+ 它的流程如下:

![自动配置流程](../../文件/图片/SpringBoot图片/自动配置流程.png)

+ 我们实现自动配置的流程如下:
  + 首先我们想实现什么功能，就需要导入什么场景
  + SpringBoot自动进行依赖导入
  + 寻找类路径下 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports文件
  + 项目启动时，就加载自动配置类，但**并不是所有自动配置都会生效，因为每个自动配置类生效都有其先决条件**
+ SPI机制
  + Java中的SPI（Service Provider Interface）是一种软件设计模式，用于在应用程序中动态地发现和加载组件。SPI的思想是，定义一个接口或抽象类，然后通过在classpath中定义实现该接口的类来实现对组件的动态发现和加载。
  + 在Java中，SPI的实现方式是通过在META-INF/services目录下创建一个以服务接口全限定名为名字的文件，文件中包含实现该服务接口的类的全限定名。当应用程序启动时，Java的SPI机制会自动扫描classpath中的这些文件，并根据文件中指定的类名来加载实现类。
  + SpringBoot也提供了SPI的实现，就是寻找META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports文件来达到自动配置
+ SpringBoot可以通过@EnableXxx注解手动开启某些功能的开关
  + 这些注解生效的原理都是利用@Import把此功能要用的组件导入进去

---

#### ④生命周期、事件与监听器

##### Ⅰ自定义监听器

+ 这里以实现全生命周期监听器为例来示范:
+ 在应用运行的各个生命周期下，我们可以自定义监听器来对事件的生命周期进行监听，并针对其事件做出不同的响应
  + 我们需要自定义一个类**实现SpringApplicationRunListener接口**
  + 在META-INF/spring.factories文件内配置`org.springframework.boot.SpringApplicationRunListener=自定义Listener全类名`
  + 除了我们自定义的监听器，SpringBoot还配置了默认的Listener，因为在org.springframework.boot包下的META-INF目录中的spring.factories文件内就配置了对应的监听器:`sorg.springframework.boot.SpringApplicationRunListener=org.springframework.boot.context.event.EventPublishingRunListener`
+ [监听器示例](../../源码/SpringBoot/EventAndListener/src/main/java/com/springboot/example/eventandlistener/listener/MyListener.java)

---

##### Ⅱ事件与探针

+ SpringBoot提供了九大事件，其中包括两个探针:
  + ApplicationStartingEvent:应用启动但未做任何事情, 除过注册listeners and initializers
  + ApplicationEnvironmentPreparedEvent: 环境变量已经准备好了，但IOC容器还未创建
  + ApplicationContextInitializedEvent:IOC容器创建完毕，但还没有任何bean加载
  + ApplicationPreparedEvent:容器刷新之前，bean定义信息加载
  + ApplicationStartedEvent:容器刷新完成， runner未调用
  + AvailabilityChangeEvent:**存活探针**，它表示项目启动到现在，项目依然在运行，但**它不意味着项目能对外界的请求做出响应**
  + ApplicationReadyEvent:任何runner被调用，该事件就会触发
  + AvailabilityChangeEvent:ReadinessState.ACCEPTING_TRAFFIC**就绪探针**，可以接请求，它表示runners都执行成功了，项目现在可以接受请求并响应了
  + ApplicationFailedEvent:启动出错事件
+ 另外，SpringBoot还提供了多个事件回调监听器:
  + BootstrapRegistryInitializer:感知引导初始化阶段的事件
  + ApplicationContextInitializer:感知ioc容器初始化的相关事件
  + ApplicationListener:**感知全阶段事件**。 一旦到了哪个阶段可以做别的事
  + SpringApplicationRunListener:**感知全阶段生命周期** + 各种阶段都能自定义操作；功能更完善。
  + ApplicationRunner:感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪
  + CommandLineRunner:感知特定阶段：感知应用就绪Ready。卡死应用，就不会就绪
+ 如果我们想使用这些回调监听器，我们需要
  + 自定义一个类，实现我们想实现的接口，即上面列举的各个的事件回调监听器
  + 接下来在`classpath:META-INF/spring.factories`文件内编写`实现的监听器接口全类名=自定义监听器全类名`
+ 总之，如果我们想做一些事情
  + 如果项目启动前做事：使用 BootstrapRegistryInitializer和 ApplicationContextInitializer
  + 如果想要在项目启动完成后做事： 使用ApplicationRunner和 CommandLineRunner
  + 如果要干涉生命周期做事：SpringApplicationRunListener
  + 如果想要用事件机制：ApplicationListener
![事件顺序](../../文件/图片/SpringBoot图片/事件顺序.png)
![生命周期流程](../../文件/图片/SpringBoot图片/生命周期流程.png)

---

##### Ⅲ生命周期启动加载机制

+ 如下图所示:

![生命周期启动加载机制](../../文件/图片/SpringBoot图片/生命周期启动加载机制.png)

+ 项目启动先进行生命周期的加载，具体就是上面的监听器能够监听到的生命周期，其中掺杂者一些事件
+ 在加载到一半时，即在contextLoaded完成，但started之前会进行IOC容器的刷新操作
+ 刷新操作会将所有的bean加载进IOC容器，就是Spring容器刷新的经典12大步，这12大步可以划分成两部分
  + 创建工厂
  + 使用工厂创建bean
+ 其中，自动配置相关的加载会在创建工厂的最后一步，即invokeBeanFactoryPostProcessors（执行bean工厂后置处理器）的方法调用时执行

---

#### ⑤自定义starter

+ 如果我们想自定义starter，需要首先写好业务类:
  + [controller层](../../源码/SpringBoot/SpringBoot-starter-robot/src/main/java/com/springboot/example/springbootstarterrobot/controller/RobotController.java)
  + [service层](../../源码/SpringBoot/SpringBoot-starter-robot/src/main/java/com/springboot/example/springbootstarterrobot/service/RobotService.java)
+ 之后要可以写Properties配置类，使用@ConfigurationProperties注解可以指定配置文件的前缀:
  + [Properties配置类](../../源码/SpringBoot/SpringBoot-starter-robot/src/main/java/com/springboot/example/springbootstarterrobot/properties/RobotProperties.java)
+ 之后编写AutoConfiguration类，**可以使用@Import注解或者@Bean注解向IOC容器提供bean**
  + 我们在此之前，即在controller、service和properties类中写的@Component、@Service和@Controller注解实际上是不会生效的，只是为了防止IDEA报错才写。因为导入时这些类不会被直接导入，而是通过AutoConfiguration类导入，因此**只有在AutoConfiguration类中提供了它们的bean,他们才会加入到IOC容器中**
  + [AutoConfiguration类](../../源码/SpringBoot/SpringBoot-starter-robot/src/main/java/com/springboot/example/springbootstarterrobot/autoconfiguration/RobotAutoConfiguration.java)
+ 接下来我们要使用`mvn install`命令将我们的自定义starter放入本地仓库，因为不放的话Maven就会去别的仓库找，别的仓库那肯定是没有的
  + 放入本地仓库时，我们需要提供至少一个主类，可以随便写一个然后提供一个main方法，但是main方法里面什么都不写
  + 这个主类在未来其他人导入本依赖时它不会起作用，因为我们只能使用通过AutoConfiguration类提供的bean，我们只需要让AutoConfiguration类不导入主类，我们就使不了这个主类了
+ 之后就是在pom.xml文件内使用dependency标签导入依赖，注意要**加上版本号（version），要不然Maven依旧认为本地仓库没有这个依赖而去别的仓库寻找**
+ 之后就是使用了，但是仅导入依赖是使用不了的，因为**SpringBoot默认只能扫描项目启动类所在目录内的包，而我们导入的依赖不在这个包下**。我们有三种方式解决该问题
  + 可以在项目启动类上直接使用@Import导入依赖的自动配置类，然后由自动配置类导入bean
  + 可以自定义Enable注解，[样例](../../源码/SpringBoot/SpringBoot-use-robot/src/main/java/com/springboot/example/springbootuserobot/customannotation/EnableRobot.java)
  + 依靠SpringBoot的SPI机制，在META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports文件内提供自动配置类的全类名，[样例](../../源码/SpringBoot/SpringBoot-use-robot/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports)
+ 最后，我们自定义的Properties内的属性与properties或yaml文件的映射是没有提示的，如果想让IDEA提供提示，需要导入一个依赖:
  + 这个依赖就在SpringBoot创建模板时，选择依赖一栏中Developer Tools下的Lombok下面，勾一下就行

~~~xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
~~~

---

#### ⑥配置隔离

+ 在开发时，我们可能有多种不同的环境，我们希望我们的环境不同，我们项目的部分类的生效情况也不同
+ SpringBoot针对这种需求，提供了一种配置隔离的方式，来进行配置:
  + Springboot提供了@Profile注解来让我们指定当我们的项目处于什么环境时，被其作用的类的@Component、@Configuration等注解才会生效
  + 在项目中，**默认的环境是default**，在该环境下，没有被@Profile注解作用的其他类都可以使用,当然，@Profile("default")注解作用的类也能使用
  + 我们的环境名可以随便起
  + 可以在配置文件中指定spring.profiles.active配置项来切换对应环境，它是一个数组对象，可以传多个值
  + spring.profiles.default配置项可以配置默认环境，默认的默认环境是default
  + spring.profiles.include用来表示包含的环境
    + 最终生效的环境=(spring.profiles.active配置的环境)+(spring.profiles.include配置的环境)
    + **一般我们把基础的环境，也就是无论什么情况都用到的环境加入到包含环境（spring.profiles.include）中去**
    + **需要动态切换的环境使用spring.profiles.active指定**
  + 我们还可以进行环境的分组
    + spring.profiles.group.{groupName}用来进行分组，我们可以把多个环境放到同一个组下，并给组起名字（在groupName那里起）
    + 必须把profile文件放在与application同级的目录下才有效
  + 除properties文件外，我们还能编写application-{profile}.properties文件，其中profile与我们的环境名一致
    + 在application-{profile}.properties文件中，我们可以编写该环境下对应的配置
    + 如果该环境被激活，SpringBoot就会读取该profile文件
    + application-{profile}.properties文件内**无法配置profile的相关配置**
  + 如果@Profile作用在配置类上以及其方法上，那么意思就是，当同时开启满足两个@Profile场景时，该方法上的其它注解才会生效
+ [配置类样例](../../源码/SpringBoot/SpringBootConfiguration/src/main/java/com/springboot/example/springbootconfiguration/config/MyConfig.java)
+ [总配置文件](../../源码/SpringBoot/SpringBootConfiguration/src/main/resources/application.properties)
+ [profile文件](../../源码/SpringBoot/SpringBootConfiguration/src/main/resources/application-other.properties)
+ [启动类](../../源码/SpringBoot/SpringBootConfiguration/src/main/java/com/springboot/example/springbootconfiguration/SpringBootConfigurationApplication.java)

---

#### 杂项

##### Ⅰbanner

+ 我们项目启动的时候，可以看到SpringBoot输出了一段类似logo的东西，这玩意叫banner。
+ SpringBoot默认读取spring.banner.location所指定的txt文件来读取banner
+ 我们可以通过配置项spring.banner.location指定对应的banner.txt相关位置来让控制台输出我们自定义的banner
+ 此处提供一个[自定义banner自动生成网站](https://www.bootschool.net/ascii)
+ [banner文件示例](../../源码/SpringBoot/SpringBootConfiguration/src/main/resources/banner/myBanner.txt)
+ 另外，SpringBoot在启动时，我们还可以以代码的方式给项目进行一些配置:
  + 我们都知道项目通过run方法来运行
  + 在点开源码后，我们发现它实际上是根据我们的Application类对象创建了一个SpringApplication对象，又调用的该对象run方法
  + 这样，我们其实可以将一行代码拆成两行代码，这样做的目的是为了得到SpringApplication对象
  + 得到SpringApplication对象，我们只需要保证运行它的run方法即可，但是在中间，我们还可以对该对象进行一些配置
  + **这些配置会在运行期间生效，但它的优先级没有配置文件设置的优先级高**
  + 为了简化我们的操作，SpringBoot提供了SpringApplicationBuilder类对象来供我们进行链式调用，方便我们进行配置

~~~java
    public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
        // 这是我们调用的静态run方法，可以看到它调用了重载的run方法
        return run(new Class[]{primarySource}, args);
    }
    public static ConfigurableApplicationContext run(Class<?>[] primarySources, String[] args) {
        // 该run方法根据传来的Class数组创建了一个SpringApplication对象，然后调用了该对象的run方法
        return (new SpringApplication(primarySources)).run(args);
    }
~~~

+ [代码配置样例](../../源码/SpringBoot/SpringBootConfiguration/src/main/java/com/springboot/example/springbootconfiguration/SpringBootConfigurationApplication.java)

---

### （五）项目规范

#### ①返回格式

+ 我们给前端的返回值应该有一个统一的返回格式:
  + 表示请求状态的code状态码
    + 该状态码一般使用枚举类来呈现
    + [枚举类样例](../../源码/SpringCloud/SpringCloud-Pay/src/main/java/com/example/cloud/resp/ReturnCodeEnum.java)
  + 本次请求所返回的数据data
    + 如果数据内包含日期时间相关的属性或对象，可以参考下面的日期时间格式自定义规范表来自定义时间样式
      + 可以通过`spring.jackson.date-format`来自定义时间样式，一般使用`yyyy-MM-dd HH:mm:ss`就行。另外可以通过`spring.jackson.time-zone`指定时区，`GMT+8`为东八区
      + 也可以使用@JsonFormat，将其作用在时间属性上，通过pattern和timezone属性来指定自定义时间格式与时区
      + ![日期时间格式自定义规范表](../文件/图片/Java图片/自定义日期格式规范表.png)
  + 描述本次请求的结果message
  + 处理请求的时间戳timeStamp,用来**判断是否使用了缓存**
  + [返回类样例](../../源码/SpringCloud/SpringCloud-Pay/src/main/java/com/example/cloud/resp/ReturnData.java)

---

#### ②全局异常处理

+ 使用全局异常处理处理异常
  + 使用HttpStatus枚举类来得到对应的状态码对象
  + 使用`log.error`方法来进行日志的记录
  + 利用通用的返回类将异常返回给前端，或者处理异常

---

## 三、整合

### （一）整合Redis

#### ①Jedis

+ Jedis是Redis官方提供的类似JDBC的与Redis数据库进行交互的库
+ 首先记得导包:

~~~xml
  <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
      <version>5.1.0</version>
  </dependency>
~~~

+ [Jedis样例](../../源码/Redis/src/main/java/com/springboot/example/redis/redisdemo/JedisSample.java)

---

#### ②lettuce

+ Lettuce是一个Redis的Java驱动包，Lettuce翻译为生菜，没错，就是吃的那种生菜，所以它的Logo就是生菜
+ Jedis的相关操作在使用Redis客户端的时候，每个线程都要拿自己创建的Redis实例去连接Redis客户端，当存在很多线程的时候，不仅开销大需要反复创建关闭一个Redis连接，而且还线程不安全，一个线程通过Jedis实例更改Redis服务器中的数据之后会影响另一个线程
+ Lettuce底层使用的是Netty,当有多个线程需要连接Redis服务器时，它可以保证只创建一个Redis连接，使所有线程都共享该连接。这样既减少了资源开销，也是线程安全的(不会出现一个线程通过Jedis实例更改Redis服务器中的数据之后会影响另一个线程的情况)
+ 导包时，如果使用的是SpringBoot,那么直接把`Spring Data Redis`勾上就行，它内部已经导入了Lettuce依赖
+ 也可以手动导入:

~~~xml
  <!--lettuce-->
   <dependency>
       <groupId>io.lettuce</groupId>
       <artifactId>lettuce-core</artifactId>
       <version>6.2.1.RELEASE</version>
   </dependency>
~~~

+ [lettuce样例](../../源码/Redis/src/main/java/com/springboot/example/redis/redisdemo/LettuceSample.java)

#### ③RedisTemplate

+ RedisTemplate是Spring官方整合的与Redis进行交互的封装类
+ 首先配置config类，我们**需要在配置类中手动提供RedisTemplate对象并设置其数据的序列化器**，因为自动注入的对象，其序列化方式会导致Redis中文乱码:
  + 自动注入的对象无法序列化中文的原因是它默认使用JDK的序列化方式，没办法序列化中文
  + 另外，**也可以通过使用RedisTemplate的子类StringRedisTemplate类来避免中文的无法序列化**，因为其子类采用的序列化方式与父类不同。这一点在其无参构造器源码中就有显著体现

~~~java
    @Configuration
    public class RedisConfig {

        @Bean
        public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory lettuceConnectionFactory) {
            // 手动创建RedisTemplate对象
            RedisTemplate<String,Object> redisTemplate = new RedisTemplate<>();

            redisTemplate.setConnectionFactory(lettuceConnectionFactory);
            //设置key序列化方式string，防止key乱码
            redisTemplate.setKeySerializer(new StringRedisSerializer());
            //设置value的序列化方式json，使用GenericJackson2JsonRedisSerializer替换默认序列化，防止value乱码
            redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

            redisTemplate.setHashKeySerializer(new StringRedisSerializer());
            redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

            redisTemplate.afterPropertiesSet();

            return redisTemplate;
        }
    }
~~~

+ 接下来是RedisTemplate的使用方法:
  + 先调用`opsXxx`方法来确定要操作的数据类型，再进行相关的操作

~~~java
    @Service
    @Slf4j
    public class RedisService {
        @Resource
        // 这个玩意也可以直接注入StringRedisTemplate类，因为它是RedisTemplate的子类，功能更丰富，也支持中文序列化。缺点是操作对象只能是字符串类型
        RedisTemplate<String,Object> redisTemplate;  
        public String setData(String key,String value){
            redisTemplate.opsForValue().set(key,value);
            log.info(key);
            return getData(key);
        }

        public String getData(String key){
            return (String)redisTemplate.opsForValue().get(key);
        }
    }
~~~

---

#### ④连接Redis集群

+ 配置项:

~~~properties

    spring.application.name=Redis

    spring.data.redis.password=123456
    # 设置最大重定向次数
    spring.data.redis.cluster.max-redirects=3
    # 设置最大连接池最大数量
    spring.data.redis.lettuce.pool.max-active=8
    # 连接池阻塞的最大等待时间
    spring.data.redis.lettuce.pool.max-wait=-1ms
    # 连接池中的最大空闲连接
    spring.data.redis.lettuce.pool.max-idle=8
    # 连接池中的最小空闲连接
    spring.data.redis.lettuce.pool.min-idle=0
    # 连接的集群节点
    spring.data.redis.cluster.nodes=8.130.44.112:6381,8.130.44.112:6382,\
      8.130.66.96:6383,8.130.66.96:6384,\
      8.130.87.94:6385,8.130.87.94:6386
    # 开启集群拓扑动态感应刷新
    spring.data.redis.lettuce.cluster.refresh.adaptive=true
    # 设置定时刷新频率
    spring.data.redis.lettuce.cluster.refresh.period=2000

~~~

+ 接下来直接操作即可，操作方式与redisTemplate一致

---

### （二）文件上传

#### ①文件保存本地

+ 后端在接收文件时，如果是单文件，可以这样接收:

~~~java
    @PostMapping(value = "xxx")
    public String fileUpload(@RequestParam(name = "xxx")MultipartFile file) throws Exception{
        // fileUploadService是业务处理的service层类
        fileUploadService.fileUpload(file);
        return "OK";
    }
~~~

+ 如果是多文件，可以这样接收:

~~~java
    @PostMapping(value = "xxx")
    // 使用实体类接收，实体类的属性为 public List<MultipartFile> files 。该属性需要与前端传来的多文件数组保持一致
    // 如果使用List<MultipartFile>直接来接收，会报错
    public String fileUpload( FileEntity files) throws Exception{
        List<MultipartFile> multipartFiles = files.getFiles();
        for(MultipartFile file:multipartFiles){
            System.out.println(file);
            fileUploadService.fileUpload(file);
        }
        return "OK";
    }
~~~

+ 接收到文件以后，为了防止多个用户同时上传同名的文件导致保存的文件出现冲突，可以使用UUID给文件进行重命名再保存:

~~~java
    public boolean fileUpload(MultipartFile file) throws Exception{
        String fileName = file.getOriginalFilename();  // 
        fileName=fileName.substring(fileName.lastIndexOf('.'));
        file.transferTo(new File("E:"+ File.separator+"testImg"+File.separator+ UUID.randomUUID().toString()+fileName));
        return true;
    }
~~~

+ 相关API

|归属|方法|参数|描述|返回值|返回值类型|异常|备注|样例|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|MultipartFile|getOriginalFilename()|无参|得到文件名称|>|字符串|无异常|无|[样例](../../源码/SpringBoot/FileUpload/src/main/java/com/springboot/example/fileupload/service/FileUploadService.java)|
|^|getInputStream()|无参|获得文件的输入流对象|>|输入流对象|无异常|无|^|
|^|getSize()|无参|得到文件大小|>|long类型数值|无异常|无|^|

+ 相关配置:
  + `spring.servlet.multipart.enabled`:开启文件上传功能，默认就是开启的
  + `spring.servlet.multipart.max-file-size`:限制单文件上传的最大大小
  + `spring.servlet.multipart.max-request-size`:限制单次请求上传的文件总量大小

---

#### ②文件上传OSS

+ 这里以上传阿里云为例，详情参见[官方文档](https://help.aliyun.com/zh/oss/getting-started/sdk-quick-start?spm=a2c4g.11186623.0.0.47422b4cPAOzJK)
+ 使用阿里云的OSS需要先创建一个bucket，另外再申请一个acesskey
  + bucket直接在控制台创建就行
  + accesskey需要在右上角点击AccessKey管理，然后创建一个。**创建以后需要记住我们的AccessKey和KeySecret，否则将无法再查询到**
   
  ![AccessKey管理](../../文件/图片/SpringBoot图片/文件上传图例1.png)

+ 接下来写一下上传逻辑
  + 首先不应该把一些配置信息，如endPoint、acessKey等信息写在代码里面，应该写在配置文件中:[配置文件](../../源码/SpringBoot/FileUpload/src/main/resources/application.properties)
  + 之后创建一个Properties类，通过SpringBoot的自动装配，把这些配置加载进来:[类样例](../../源码/SpringBoot/FileUpload/src/main/java/com/springboot/example/fileupload/components/FileUploadConfig.java)
  + 把该配置类导入到Service类中，通过getter方法得到对象，然后进行文件上传的业务:[service类](../../源码/SpringBoot/FileUpload/src/main/java/com/springboot/example/fileupload/service/impl/FileUploadServiceImpl.java)

---

### （三）日志配置

#### ①日志简述

+ 在开发中，我们应该使用日志来记录信息

|日志门面|日志实现|
|:---:|:---:|
|JCL(Jakarta Commons Logging)|Log4J<br>JUL(java.util.logging)<br>Log4j2<br>Logback|
|SLF4J(Simple Logging Facade for Java)|^|
|jboss-logging|^|

+ SpringBoot的默认日志配置是`SLF4J+Logback`，但我们可以自定义想实现的日志，不过SpringBoot的默认日志配置已经够用了
+ 在Spring5版本后，commons-logging被spring直接自己封装了

---

#### ②实现原理

+ 核心场景`spring-boot-starter`内引入了`spring-boot-starter-logging`
+ 一般情况下，对应的依赖都会有一个自动配置类，叫XxxAutoConfiguration
+ 但是日志比较特殊，它需要在程序启动时就执行，因此不能在程序启动时再加载器配置项
+ 因此**日志利用的是监听器机制配置**好的
+ 不过，我们依然能够通过配置文件来修改日志的配置

---

#### ③输出格式

+ SpringBoot的默认输出格式为（从左到右）:
  + 时间和日期:精确到毫秒
  + 日志级别:根据情况，会打印**ERROR**、**WARN**、**INFO**、**DEBUG**或**TRACE**
  + 进程ID
  + ---:消息分隔符
  + 线程名:当前执行操作的方法所在的线程，使用[]包含
  + Logger名:通常是产生日志的类名
  + 消息:打印的日志信息
+ **Logback并没有FATAL级别的日志，取而代之的是ERROR**
+ 其默认的输出格式参数参照spring-boot包下的additional-spring-configuration-metadata.json文件
+ 默认输出值为:`%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd'T'HH:mm:ss.SSSXXX}}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}`
+ 可以修改为`%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level [%thread] %logger{15} ===> %msg%n`

+ [配置类样例](../../源码/SpringBoot/SpringBootLogging/src/main/resources/application.properties)

---

#### ④日志级别与分组

+ 日志级别一般分为如下类别（由高到低）:
  + ALL:打印所有日志
  + TRACE:追踪框架的详细流程日志并打印
  + DEBUG:开发调试细节日志
  + INFO:关键的、感兴趣的日志
  + WARN:警告但不是错误的日志，如版本过时的信息
  + ERROR:业务错误日志，如出现各种异常
  + FATAL:致命错误日志，如JVM虚拟机系统崩溃
  + OFF:关闭所有日志记录
+ 在以上的日志级别中，**我们可以主动输出日志信息的有TRACE、DEBUG、INFO、WARN、ERROR这五个**
+ **在指定某一日志级别后，系统只会打印该级别或该级别以下的日志信息**，如指定了INFO作为日志级别，那么系统仅会打印INFO、WARN、ERROR、FATAL等日志信息，而级别高的DEBUG和TRACE不会打印
+ **SpringBoot默认使用Logback作为日志实现依赖，且默认指定的日志级别为INFO**
+ SpringBoot支持我们自定义全局的日志级别，或自定义某一类的日志级别
  + 我们可以通过[下表]查阅如何指定，或者查看[样例]()
  + 但是，当我们想手动指定的类的日志级别变多时，配置会非常繁琐，因此SpringBoot又提供了分组功能来简化配置
    + 我们可以将多个类组成一个组，然后将这一个组看成一个整体，进行日志级别的指定
    + SpringBoot已经为我们提供了两个默认的组:
      + web组:包含org.springframework.core.codec、org.springframework.http、org.springframework.web、org.springframework.boot.actuate.endpoint.web、org.springframework.boot.web.servlet.ServletContextInitializerBeans类
      + sql组:包含org.springframework.jdbc.core、org.hibernate.SQL、org.jooq.tools.LoggerListener类

+ [配置类样例](../../源码/SpringBoot/SpringBootLogging/src/main/resources/application.properties)

---

#### ⑤文件输出、归档与滚动切割

+ **文件输出**
  + 通过`logging.file.name`可以指定输出的文件的名字，如果文件不存在，会在当前项目所在目录内创建一个，然后输出日志
    + 可以为其指定路径，使得日志文件保存在指定路径下，且名称也可以自定义，因此**推荐使用该方式**
  + 通过`logging.file.path`可以指定输出的文件的路径，使用该方式输出文件，spring会自动创建一个Spring.log文件。当`logging.file.name`配置存在时，后者优先级更高
+ **归档**
  + 通过某种区分方式来将日志划分到指定目录叫做归档（一般按时间，如一天对应一个目录）
  + 该方式主要是为了防止一直将日志输出到一个文件导致文件过大的问题
  + 归档是只有当一整天结束时，SpringBoot才会进行本日的日志归档，因此我们如果想看到效果，需要向后调一天
+ **滚动切割**
  + 即使使用了归档，可能也会出现日志文件过大的情况，因此我们可以按某些标准（如限制单文件最大大小）来将文件切片
  + 该方式进一步解决了文件过大的问题
  + 这玩意貌似只能识别整数，比如设置的是1MB大小的限制，它会等到日志文件到2MB以上才会进行切割

+ [配置类样例](../../源码/SpringBoot/SpringBootLogging/src/main/resources/application.properties)

---

#### ⑥自定义配置

+ 如果我们认为SpringBoot的配置文件用着不爽，我们也可以使用传统的xml文件的方式来自定义日志
  + xml文件的命名需要严格遵守SpringBoot的对应规范:
    + 建议名称都以`xxx-spring.xml`的规范命名，因为这样SpringBoot可以完全控制该配置文件

|日志系统|文件命名规范|
|:---:|:---:|
|Logback|logback-spring.xml(**推荐**), logback-spring.groovy, logback.xml, or logback.groovy|
|Log4j2|log4j2-spring.xml（**推荐**） or log4j2.xml|
|JDK (Java Util Logging)|logging.properties|

+ 另外，当我们想切换日志组合时，我们需要先排除掉SpringBoot所指定的默认日志组合
  + 我们可以利用Maven的就近原则，在我们的项目内直接引入spring-boot-starter依赖，然后在下面排除掉spring-boot-starter-logging依赖

~~~xml

  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
      <exclusions>
          <exclusion>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-logging</artifactId>
          </exclusion>
      </exclusions>
  </dependency>

~~~

+ 接下来导入我们对应的场景，比如我们想导入log4j2的场景，导入前需要确认[官方](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.logging)是否支持

~~~xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-log4j2</artifactId>
  </dependency>
~~~

+ 然后就可以使用了
+ log4j2的性能相较于Logback有很大提升，推荐使用log4j2
+ 如果想使用log4j2,**Spring官方推荐其配置文件写log4j2-spring.xml**
+ **log4j2支持yaml和json格式的配置文件**:

|文件格式|实现支持需要导入的依赖|规范文件名|
|YAML|**com.fasterxml.jackson.core:jackson-databind**和**com.fasterxml.jackson.dataformat:jackson-dataformat-yaml**|log4j2.yaml或log4j2.yml|
|JSON|com.fasterxml.jackson.core:jackson-databind|log4j2.json或log4j2.jsn|

+ [项目pom.xml文件](../../源码/SpringBoot/SpringBootLogging/pom.xml)
+ [配置类样例](../../源码/SpringBoot/SpringBootLogging/src/main/resources/application.properties)
+ [log4j2-spring.xml样例](../../源码/SpringBoot/SpringBootLogging/src/main/resources/log4j2-spring.xml)

---

#### ⑦配置总览

|配置|作用|备注|
|:---:|:---:|:---:|
|logging.level.{root\|sql\|web\|类的全类名\|自定义组名}|指定全局/sql组/web组/类/自定义组的日志级别|无|
|logging.group.自定义组名|将多个类划分为一个组|无|
|logging.file.name|指定日志输出的文件|也可以写路径，如果是相对路径，那么是相对于项目所在目录的|
|loggging.file.path|指定日志输出的路径|优先级没有logging.file.name高|
|logging.logback.rollingpolicy.file-name-pattern|指定日志归档的命名格式，默认值是`${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz`|从配置项可以看出，只有使用Logback才能使用该配置|
|logging.logback.rollingpolicy.clean-history-on-start|应用启动前是否清除以前日志文件（默认为false）|^|
|logging.logback.rollingpolicy.max-file-size|指定每个日志文件的最大大小|^|
|logging.logback.rollingpolicy.total-size-cap|指定日志文件总大小超过指定大小后，就删除旧的日志文件（默认0B）|^|
|logging.logback.rollingpolicy.max-history|日志文件保存的最大天数（默认7，单位天）|^|

---

### （四）整合SSM

#### ①RequestContextHolder

+ RequestContextHolder是Spring官方提供的用于承载requestAttributes（request和response的封装）对象的一个工具类，它提供了相关的静态方法，可以在任意位置获得请求和响应
+ 我们可以通过getRequestAttributes静态方法来获得request和response的封装对象，然后通过该封装对象的getRequest方法来获得请求对象。同理也可以获得响应对象

|归属|方法|参数|描述|返回值|返回值类型|异常|备注|样例|
|RequestContextHolder|`getRequestAttributes()`|无参|>|得到request和response的封装对象|RequestAttributes|无异常|无|[任意位置获取请求样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/java/com/springboot/example/springbootthymeleaf/service/MyService.java)|
|ServletRequestAttributes（它间接实现了RequestAttributes接口）|`getRequest()`|无参|得到请求对象|HttpServletRequest对象|HttpServletRequest|无|无|^|
|^|`getResponse()`|无参|得到响应对象|HttpServletResponse对象|HttpServletResponse|无|无|^|

---

#### ②路径匹配

+ 路径匹配就是Controller层在接受请求时针对请求路径的路径匹配
+ Spring5.3之前，只支持AntPathMatcher的路径匹配策略，在Spring5.3时，添加了新的PathPatternParser的路径匹配策略
+ 我们也可以在配置文件内进行相对的配置

|Ant风格通配符|作用|备注|样例|
|:---:|:---:|:---:|:---:|
|*|匹配一层下所有字符|无|`*.html`表示匹配任意html文件|
|?|表示匹配一个任意字符|无|`/fol?er/*.html`表示匹配fol(任意字符)er目录下的任意html文件|
|**|匹配后面的所有层|无|`/folder2/**/*.jsp` 匹配在folder2目录下任意目录深度的.jsp文件|
|{name}|将对应层的值取出，放入name中|无|`/{type}/{id}.html` 匹配任意文件名为{id}.html，在任意命名的{type}目录下的文件|
|[]|匹配对应的字符集合|无|无|

+ PathPatternParser兼容 AntPathMatcher语法，并支持更多类型的路径模式，**它的效率较PathPatternParser的效率高**
+ **PathPatternParser的`**`多段匹配仅能写在路径最后，不能再在中间写**。如果想这样用，需要在配置文件内把匹配准则改为PathPatternParser
+ 新版的默认路径匹配规则是PathPatternParser匹配原则
+ 使用`spring.mvc.pathmatch.matching-strategy`来手动修改路径匹配原则
  + ant_path_matcher表示恢复到AntPathMatcher
  + path_pattern_parser表示改为新版匹配原则

---

#### ③静态资源配置

+ SpringBoot默认已经配置了一些静态资源的配置:
  + 当前端请求/webjars/**相关资源时，后端从默认从classpath:META-INF/resources/webjars文件夹内找
  + 当前端请求/**相关资源时，后端默认从下面四个路径下找:
    + classpath:/META-INF/resources/
    + classpath:/resources/
    + classpath:/static/
    + classpath:/public/
+ 静态资源配置可以通过两种方式配置:
  + 通过**配置文件配置**:由于在上面出现了配置文件前缀，因此只要找对应的前缀，配置对应的属性即可
  + 通过**代码进行配置**:通过配置类实现WebMvcConfigurer接口并实现其addResourceHandlers来进行配置，但**不要在配置类上加@EnableWebMvc注解，一旦加上，原有的默认配置会失效**
+ 另外，部分浏览器会自动请求favicon.ico这个文件，因此在`/**`路径想映射的后端路径内加一个favicon.ico文件，就可以让网页显示出自定义的小图标了

|配置|作用|属性值|备注|
|:---:|:---:|:---:|:---:|
|spring.mvc.static-path-pattern|用来**设置匹配的前端请求静态资源的路径**|字符串值|无|
|spring.mvc.webjars-path-pattern|用来**设置匹配的前端请求webjars资源的路径**|字符串值|无|
|spring.web.resources.static-locations|配置用来设置后端处理静态资源要寻找的目录，**它会覆盖掉SpringBoot默认配置的四个路径**|字符串值|**针对webjars的路径匹配依然有效，因为根据源码，webjars相关的路径匹配被单独配置了，而该项配置与webjars的路径匹配没有关系**|
|spring.web.resources.add-mappings|开启静态资源映射|默认为true|无|
|spring.web.resources.cache.period|配置浏览器使用资源的大概时间|数值，单位秒|**如果配置了控制项，该配置会被覆盖**|
|spring.web.resources.cache.use-last-modified|配置是否在浏览器找服务器请求资源前，先发送请求确认资源是否发生了更改|布尔值|无|
|spring.web.resources.cache.cachecontrol.max-age|配置浏览器使用缓存的最大时间，在此期间，浏览器会使用缓存加载资源|数值，单位秒|无|
|spring.web.resources.cache.cachecontrol.cache-public|设置是否共享缓存|布尔值|无|

+ 可以通过查看状态码来确认是否有缓存，**出现304状态码或网络栏中的履行者显示为`disk cache`即为使用了缓存**
  + 刷新网页不会使用缓存，详情见下图:
    + 其中Etag 是 HTTP 响应头部的一部分，用于标识资源的版本。它通常由服务器生成，并在响应中发送给客户端
![缓存机制](../../文件/图片/SpringBoot图片/HTTP缓存机制.png)
+ 另外，配置的寻找路径可以有两个头符号:
  + `classpath:`:即表示类路径下，也就是从target目录中classes目录开始的东西，或者java目录或resources目录下的东西
  + `file:`:表示文件系统路径，它支持相对路径（相对于本项目的跟路径）和绝对路径。
+ 最后，静态资源是这样匹配的
  + 如果前端请求`localhost:8080/context-path/haha/upload/aaa.png`，上下文路径是`context-path`
  + 我们匹配的是`/haha/**`
  + 那么我们截取的就是`/upload/aaa.png`这一段，然后我们重新配置静态资源的路径，比如我们配置了一个`classpath:/xxx/`
  + 那么最后服务器要去寻找的对应静态资源路径就是`classpath:/xxx/upload/aaa.png`这一路径，也就是说，如果前端的请求路径成功与们设置的匹配路径匹配到了，那么我们服务器就会把我们配置的静态资源路径+`**`后面的路径拼接起来，作为它最后会去寻找的路径



+ [配置文件](../../源码/SpringBoot/SpringBootWebStaticResource/src/main/resources/application.properties)
+ [配置类](../../源码/SpringBoot/SpringBootWebStaticResource/src/main/java/com/springboot/example/springbootwebstaticresource/config/MyConfig.java)

---

#### ④内容协商

##### Ⅰ默认协商

+ 如果我们有多个端向服务器器发送同一个请求，但是各个端期望服务器返回的请求格式不一致，此时SpringBoot会根据前端传来的**请求头参数(Accept)**或**路径参数(Param)**来进行对应的返回格式转换，该操作被称为**内容协商**
  + SpringBoot默认开启基于请求头的内容协商，服务器会根据Accept请求参数来确认使用什么格式进行返回。通过`spring.mvc.contentnegotiation.favor-parameter`来配置是否开启，默认是true
  + SpringBoot**默认不开启**基于路径参数的内容协商
    + 我们需要配置`spring.mvc.contentnegotiation.favor-parameter`来手动设置为true，以开启该方式的内容协商，默认的该方式的请求参数名为format
    + 还可以设置`spring.mvc.contentnegotiation.parameter-name`参数来手动设置以路径参数请求返回值类型时，传递该返回值类型的请求参数的名字。即SpringBoot会依据该配置的值去请求路径中去寻找对应的参数名，然后读取该值期望的返回值类型
    + **使用该方式请求的值与Accept请求值略有不同，如Accept指定的application/json，请求参数仅需要传递json即可**

---

##### Ⅱ自定义内容返回

+ SpringBoot的默认转换器能转换的格式实在有限，因此我们需要会怎么自定义内容返回
+ 我们以增加yaml返回值类型为例，来举例如何自定义内容返回
+ 首先需要导入相关依赖:

~~~xml

  <dependency>
      <groupId>com.fasterxml.jackson.dataformat</groupId>
      <artifactId>jackson-dataformat-yaml</artifactId>
  </dependency>

~~~

+ 在配置类中添加HttpMessageConverter组件，将能够转换yaml文件格式的对象添加进去

~~~java

    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override //配置一个能把对象转为yaml的messageConverter
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(new MyYamlHttpMessageConverter());
            }
        };
    }

~~~

+ 编写配置新增支持的媒体类型:
  + spring.mvc.contentnegotiation.media-types.{type}=aaa/bbb
  + 其中type是我们给这个媒体类型起的名字，这个名字是用来路径传参的时候携带的值，比如`spring.mvc.contentnegotiation.media-types.yaml=text/yaml`,那么路径传参的时候请求参数就是`type=yaml`

~~~properties
    spring.mvc.contentnegotiation.media-types.yaml=text/yaml
~~~

+ 创建一个实现了HttpMessageConverter接口的类
  + SpringBoot提供了AbstractHttpMessageConverter类，供我们更简便的实现HttpMessageConverter接口，我们只需继承该类即可
+ 继承了AbstractHttpMessageConverter类**要实现三个方法**
  + protected boolean supports(Class clazz)这里用来**筛选我们的转换器对象能够把什么类型的对象转换为我们期望的格式**
  + protected Object readInternal(Class clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException:这玩意是**用来将前端传来的参数转换为被@RequestBody注解作用的变量对象**的
  + protected void writeInternal(Object o, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException:这玩意是**用来将我们的handler执行结果转换为我们期望的格式**的
+ [自定义实现类样例](../../源码/SpringBoot/SpringBootMessageConverter/src/main/java/com/springboot/example/springbootmessageconverter/component/MyHttpMessageConverter.java)
+ 提示:如果使用浏览器进行请求测试，**浏览器因为无法解析yaml格式的返回值，会把它下载下来保存为一个文件**

---

#### ⑤Thyemeleaf

##### Ⅰ快速体验

+ [Thymeleaf](https://www.thymeleaf.org/)是一款用于前后端不分离时渲染页面的模板引擎，SpringBoot默认支持该模板引擎，但未导入对应场景
  + 除ThymeLeaf外，SpringBoot还默认支持以下引擎:
    + FreeMarker
    + Groovy
    + Mustache
+ 首先我们要导入场景

~~~xml

  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>

~~~

+ SpringBoot有专门的ThymeleafAutoConfiguration类，在其内部类DefaultTemplateResolverConfiguration内的defaultTemplateResolver方法中，设置了寻找对应模板的前缀和后缀:

~~~java
    @Bean
    SpringResourceTemplateResolver defaultTemplateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        ...
        resolver.setPrefix(this.properties.getPrefix());  // 设置寻找模板引擎的前缀
        resolver.setSuffix(this.properties.getSuffix());  // 设置寻找模板引擎的后缀
        ...
        return resolver;
    }
~~~

+ 我们通过查看getPrefix方法和getSuffix方法可以看到，默认的值分别为`classpath:/templates/`和`.html`
+ 也就是说，**该模板引擎默认从类路径下的tamplates目录下寻找xxx.html文件**
+ 现在我们可以开始编写一个简单的Thtmeleaf模板了:
  + 首先写一个controller，不要写@ResponseBody,直接返回我们想渲染的模板名称，也不需要带后缀，直接返回字符串即可
  + 在对应路径下声明一个对应的html模板，可以在其html标签下加上属性约束:`<html lang="en" xmlns:th="http://www.thymeleaf.org">`，这样idea会有提示
+ 然后就可以用了
+ [模板样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/hello.html)
+ [controller样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/java/com/springboot/example/springbootthymeleaf/controller/ThymeleafController.java)

---

##### Ⅱ核心语法

|语法|作用|值|备注|样例|
|:---:|:---:|:---:|:---:|:---:|
|th:text|将文本值渲染到对应标签内|一般使用插值表达式插入|无|[样例1](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/hello.html)|
|th:utext|将HTML渲染到对应标签内|^|浏览器会当成HTML语句渲染|^|
|th:属性|渲染属性值|^|无|^|
|th:attr|批量渲染属性值|例:`th:attr="style=${style},src=${src}"`|无|^|
|th:if|如果其表达式为真，那么该属性所在标签会被渲染|一般使用插值表达式插入，并运算|无|^|
|th:switch|相当于switch语句|一般使用插值表达式插入|无|^|
|th:case|相当于case语句|^|无|^|
|th:object|变量选择，配合*{}插值表达式可以在子标签中引用该变量|^|无|^|
|th:each|遍历集合|例:`th:each="item,state : ${list}"`|[样例2](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/list.html)|
|th:fragment|定义模板|例:`th:fragment="xxx"`|无|[样例3](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/template.html)|
|th:insert|在标签内部插入对应组件|例:`th:insert="~{templateName :: fragmentName}"`|无|[样例4](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/useTemplate.html)|
|th:replace|将该标签替换为组件|例:`th:replace="~{templateName :: fragmentName}"`|无|^|

|插值表达式|作用|备注|
|:---:|:---:|:---:|
|${}|将request域中的变量取出使用|无|
|@{}|专门用于适配URL路径，会动态的加上后端的上下文路径|无|
|#{}|国际化消息|无|
|~{}|导入片段（模板）时使用|无|
|*{}|变量选择，需要配合th:object绑定对象|无|

|系统工具/内置对象|作用|备注|
|:---:|:---:|:---:|
|param|请求参数对象|无|
|session|session对象|无|
|application|context对象|无|
|#execInfo|模板执行消息|无|
|#messages|国际化消息|无|
|#uris|uri/url工具|无|
|#conversions|类型转换工具|无|
|#dates|日期工具，是java.util.Date的工具类|无|
|#calendars|日期工具，是java.util.Calendar的工具类|无|
|#temporals|JDK8+,java.time的工具类|无|
|#numbers|数字操作工具|无|
|#strings|字符串操作工具|无|
|#objects|对象操作工具|无|
|#bools|布尔值操作工具|无|
|#arrays|数组操作工具|无|
|#lists|List操作工具|无|
|#sets|Set操作工具|无|
|#maps|Map操作工具|无|
|#aggregates|集合聚合工具(sum、avg)|无|
|#ids|id生成工具|无|

+ 其它相关操作与java基本一致，但是有几个特殊的:
  + 布尔运算中，**与操作需要使用`and`关键字，或操作需要使用`or`关键字**
  + 字符串拼接时，可以在拼接的字符串开头和结尾加上`|`来避免传统的使用`+`符号进行拼接，而是使用类似模板字符串的拼接方式进行拼接
  + 条件运算发生了一些变化:
    + if-then： `(value)?(then)`
    + if-then-else: `(value)?(then):(else)`（三元运算符）
    + default: `(value)?:(defaultValue)`
  + 如果想在属性内表示字符串，需要使用单引号引起来
  + **如果想在标签内部直接插值，可以使用`[[...]]`或`[(...)]`进行插值**

---

##### Ⅲ遍历

+ 使用th:each可以对集合进行遍历:
  + `th:each="item,state : ${list}`
    + item表示当前遍历到的集合元素，变量名可以随便取
    + state表示当前遍历到的元素的状态，这是个键值对类型的集合对象
    + list表示被遍历的集合对象，它的名字取决于request域中的待遍历对象的变量名
+ state变量中有多个属性，这些属性都有他们各自的名称:

|属性名|作用|备注|
|:---:|:---:|:---:|
|index|索引|无|
|count|遍历到的是第几个元素|无|
|size|遍历的元素总量|无|
|current|遍历到的当前元素值|无|
|even|当前的count是否是偶数|无|
|odd|当前的count是否是奇数|无|
|first|是否是第一个元素|无|
|last|是否是最后一个元素|无|

+ [样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/list.html)

---

##### Ⅳ属性优先级

+ Order值越低，优先级越高

|Order|分类|属性|
|:---:|:---:|:---:|
|1|片段包含|th:insert<br>th:replace|
|2|遍历|th:each|
|3|判断|th:if<br>th:unless<br>th:switch<br>th:case|
|4|定义本地变量|th:object<br>th:with|
|5|通用方式属性修改|th:attr<br>th:attrprepend<br>th:attrappend|
|6|指定属性修改|th:value<br>th:href<br>th:src<br>...|
|7|文本值|th:text<br>th:utext|
|8|片段指定|th:fragment|
|9|片段移除|th:remove|

---

##### Ⅴ模板布局

+ 我们有时想将网页变成一些可复用的组件，Thymeleaf也为我们提供了这一功能:
  + 如果我们想定义一个可复用的组件，我们需要在该组件最外层的标签上加上`th:fragment`属性，并给该组件起一个名字
  + 接下来我们就可以在别的地方引用了
    + 使用`th:insert`或`th:replace`属性来引用该组件
    + 属性内使用`~{}`插值表达式来专门进行引用
    + 语法为`templateName :: componentName`，如我们的组件名字叫top，它所在的文件名是template，那么引用时就是`~{template :: top}`
+ [组件样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/template.html)
+ [调用组件样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/useTemplate.html)

---

##### Ⅵ相关配置

|配置项|作用|值|备注|
|:---:|:---:|:---:|:---:|
|server.servlet.context-path|设置项目的上下文路径|默认是`/`|无|
|spring.thymeleaf.prefix|指定thymeleaf的匹配前缀|默认是`classpath:/templates/`|无|
|spring.thymeleaf.suffix|指定thymeleaf的匹配后缀|默认是`.html`|无|
|spring.thymeleaf.check-template|在响应前确认对应模板是否存在，不存在会报错|布尔值，默认为true|无|
|spring.thymeleaf.check-template-location|在响应前确认模板所在路径是否存在，不存在会报错|布尔值，默认为true|无|
|spring.thymeleaf.cache|如果浏览器已经缓存了该模板，那么就让浏览器用缓存|布尔值，默认为true|无|

---

#### ⑥国际化

+ SpringBoot默认寻找messages.properties文件来配置国际化
  + messages.properties文件是默认的国际化配置文件，**该文件必须存在，否则会报错**
  + messages_en_US.properties文件是英语（美国）的国际化配置文件，注意**该配置文件对应的语言是英语（美国）而不是英语**
  + messages_zh_CN.properties文件是简体中文的国际化配置文件
  + SpringBoot在寻找对应的国际化配置时，会先查找浏览器端的最高优先级的语言配置文件，如果没有再去其它语言配置文件寻找，寻找依据也是按照浏览器端的各语言优先级来找
  + 如果要使用Thymeleaf,那么需要使用#{}的插值表达式来读取国际化配置文件中的对应值
  + 我们可以通过spring.messages.basename配置来指定SpringBoot默认寻找的国际化文件，也可以通过spring.messages.encoding来指定国际化配置文件的解码格式
    + spring.messages.basename配置**不仅要指定上路径，还要指定上配置文件的前缀名**。如classpath:static/test.properties要指定为`static/test`
  + 关于国际化配置的相关配置类是MessageSourceAutoConfiguration类，它默认会使用MessageSourceProperties类对象进行一些操作
    + 在MessageSourceProperties类中，我们可以看到默认的basename是`messages`
+ [国际化样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/java/com/springboot/example/springbootthymeleaf/controller/ThymeleafController.java)
+ [Thymeleaf国际化样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/resources/templates/national.html)

---

#### ⑦错误处理机制

##### Ⅰ处理流程

+ SpringBoot在原来的SpringMVC对于错误处理的基础上做了对应拓展
  + SpringMVC的异常处理机制如下:
    + SpringMVC在发生了异常后，先寻找是否存在对应的ExceptionHandler来处理该异常，如果有，那么就执行该handler
    + 如果没有找到，就去寻找@ResponseStatus机制能否解决，如果可以解决那么进行解决
    + 如果依然不能，确认SpringMVC定义的默认错误响应能否处理，如果能够处理那么进行处理。如果依旧不能处理，那么就进入SpringBoot的拓展异常处理机制
  + SpringBoot的拓展异常处理机制如下:
    + 如果是出现了状态码相关的异常
      + SpringBoot先精准匹配对应页面的视图模板，先从`templates/error`目录下找，找不到再在静态资源中找
      + 如果都找不到，那么继续模糊匹配对应页面的视图模板，也遵循刚才的顺序寻找，默认寻找`4xx.html`和`5xx.html`文件
      + 如果找不到，那么继续去匹配templates目录下error的视图模板
      + 如果没有找到我们自定义的，那么SpringBoot默认会自己提供一个并返回
    + 如果出现了非状态码相关的异常
      + SpringBoot会提供DefaultErrorAttributes错误信息并返回

![错误处理流程](../../文件/图片/SpringBoot图片/错误处理流程.png)

---

##### Ⅱ自定义异常处理

+ 如果是处理页面响应，需要根据SpringBoot配置的规则，在指定目录下配置相关的错误信息视图
  + 如果发生了500、404、503、403 这些错误
    + 若视图解析器存在，那么我们在`classpath:templates/error`目录下或者静态资源目录下创建对应的错误状态码视图文件
    + 或者在在`classpath:templates/error`目录下或者静态资源目录下创建对应的模糊状态码视图文件，如`4xx.html`、`5xx.html`
    + 或者在`classpath:templates`目录下直接创建一个`error.html`文件
+ 如果处理JSON相关的响应，直接通过@RestControllerAdvice注解和@ExceptionHandler注解进行统一的异常处理

---

#### ⑧WebMvcConfigurer接口

+ 另外，实现WebMvcConfigurer接口可以配置SpringMVC底层的运作规则:

|接口方法|参数|作用|返回值|备注|
|:---:|:---:|:---:|:---:|:---:|
|configurePathMatch(PathMatchConfigurer configurer)|configurer:配置对象|配置路径匹配|void|无|
|configureContentNegotiation(ContentNegotiationConfigurer configurer)|^|配置内容协商|void|无|
|configureAsyncSupport(AsyncSupportConfigurer configurer)|^|配置异步支持|void|无|
|configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer)|^|配置项会覆盖Servlet的默认处理配置|void|无|
|addFormatters(FormatterRegistry registry)|registry:格式化器注册对象|添加格式化器|void|无|
|addInterceptors(InterceptorRegistry registry)|registry:拦截器注册对象|添加拦截器，以及设置拦截规则|void|无|
|addResourceHandlers(ResourceHandlerRegistry registry)|registry:资源处理器注册对象|添加资源处理器|void|无|
|addCorsMappings(CorsRegistry registry)|registry:跨域映射注册对象|添加跨域映射|void|无|
|addViewControllers(ViewControllerRegistry registry)|registry:视图控制器注册对象|添加视图控制器|void|无|
|configureViewResolvers(ViewResolverRegistry registry)|registry:视图解析器注册对象|添加视图解析器|void|无|
|addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers)|resolvers:参数解析器集合|添加参数解析器|void|无|
|addReturnValueHandlers(List<HandlerMethodReturnValueHandler> handlers)|handlers:返回值处理器集合|添加拦返回值处理器|void|无|
|configureMessageConverters(List<HttpMessageConverter<?>> converters)|converters:消息转换器集合|添加消息转换器|void|无|
|extendMessageConverters(List<HttpMessageConverter<?>> converters)|converters:消息转换器集合|拓展消息转换|void|无|
|configureHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers)|resolvers:异常处理器集合|添加异常处理器|void|无|
|extendHandlerExceptionResolvers(List<HandlerExceptionResolver> resolvers)|resolvers:异常处理器集合|拓展异常处理|void|无|
|getValidator()|无参|得到校验器对象|void|无|
|getMessageCodesResolver()|无参|得到错误代码规则对象|void|无|

+ 我们可以通过@EnableWebMvc注解来禁用掉WebMvcAutoConfiguration的自动配置
  + 其原理是EnableWebMvc注解内部有`@Import({DelegatingWebMvcConfiguration.class})`注解，导入了DelegatingWebMvcConfiguration类
  + DelegatingWebMvcConfiguration类是WebMvcConfigurationSupport类的子类对象
  + 而WebMvcAutoConfiguration类生效的前提之一就是WebMvcConfigurationSupport类对象不在IOC容器内
  + 因此如果我们想在SpringBoot的默认配置的前提下做一些拓展，不要给配置类加上@EnableWebMvc注解

---

#### ⑨整合Mybatis

+ 由于SpringBoot自动装配的便捷性，我们整合SSM会十分的方便
  + 首先需要导入相关依赖，在SpringBoot的项目创建页选择Web开发依赖、Lombok、MySQL驱动、Mybatis依赖（这四个都可以选）
  + 说是整合SSM，实际上SpringBoot把Spring跟SpringMVC都整合好了，我们需要做的就是配置Mybatis以及一些数据库相关配置

![SSM整合](../../文件/图片/SpringBoot图片/SSM整合1.png)

  + 如果想导入Druid连接池，由于SpringBoot没有提供，我们需要自己导:

~~~xml
    <properties>
        <java.version>17</java.version>

        <druid.version>1.2.22</druid.version>
    </properties>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>${druid.version}</version>
    </dependency>

~~~

  + 接下来就创建controller、mapper等java文件
  + 在创建mapper时，我们在创建接口之后，可以依靠MybatisX插件快速的生成对应的xml文件（按Alt+Enter）
  + 选择Generate mapper of xml

![SSM整合](../../文件/图片/SpringBoot图片/SSM整合2.png)

  + 在下面的页面选择我们的xml文件生成位置，一般我们都会选择resources目录下的mapper目录

![SSM整合3](../../文件/图片/SpringBoot图片/SSM整合3.png)

  + 在我们创建出对应的方法时，也可以通过MybatisX快速在对应的xml文件内生成标签

![SSM整合4](../../文件/图片/SpringBoot图片/SSM整合4.png)

  + 接下来创建对应的实体类对象，**不要忘记提供setter方法**，一般加一个@Data注解就行了
  + 最后配置配置文件，提供JDBC相关的四个必须配置和Mybatis的xml文件映射路径，以及选择性提供连接池、配置Mybatis的驼峰映射、主键回显等

![SSM整合5](../../文件/图片/SpringBoot图片/SSM整合5.png)

---

### （五）WebSocket

#### ①简要概述

+ WebSocket可以实现服务端向客户端发送信息

#### ②整合流程

+ 前置条件:
  + tomcat7.0.5版本及以上（tomcat在7.0.5版本才开始支持WebSocket）
+ 接下来开始:
  + 首先是前端，前端的部分很简单，就是WebSocket的API，详见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
  
  ~~~jsx

    let webSocketLink=new WebSocket(`ws://localhost:8080/chat/${userContext.userName}`);
    webSocketLink.onopen=(params)=>{
        console.log('客户端连接成功');
    };
    webSocketLink.onmessage=({data})=>{
        console.log(`收到信息:${data}`);
    };
    ...

  ~~~

  + 接下来是后端，需要导入Spring WebSocket依赖，这里Spring官方已经提供了，可以直接导
  + 我们需要先写一个配置类，提供ServerEndPointExporter对象:
    + 提供该对象后，如果在测试包下测试方法，可能会出现报错，如果出现报错，在测试类上的@SpringBootTest注解上面指定属性:`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)`

  ~~~java

    @Configuration
    @EnableWebSocket
    public class WebSocketConfig {
        @Bean
        public ServerEndpointExporter getServerEndpointExporter(){
            return new ServerEndpointExporter();
        }
    }


  ~~~

  + 然后是业务层的代码:
    + WebSocket主要有三个事件:创建连接、发送信息和关闭连接，我们主要就需要实现这三个方法。除此之外，还可以实现出现错误时的处理代码
      + 我们可以通过继承类来实现
      + 也可以通过Jarkarta官方提供的注解来实现，前提是导入Spring WebSocket依赖

|注解|作用|备注|
|:---:|:---:|:---:|
|@ServerEndpoint|声明对应类为WebSocket服务类，也就是让Spring知道这个类是处理WebSocket请求的。除此以外，还负责指定该类负责处理的路径|1.**路径必须有`/`作为前缀**<br>2.**该注解使得Spring的依赖注入无法实现**，因为WebSocket是只要有一个连接，就会创建一个对应服务类的实例，而这与Spring默认的单实例冲突，因此无法执行依赖注入|
|@OnOpen|声明对应方法在WebSocket连接时触发|无|
|@OnMessage|声明对应方法在收到信息时触发|无|
|@OnClose|声明对应方法在关闭连接时触发|无|
|@OnError|声明对应方法在出现异常时触发|无|

  + 接下来是对应的方法:

  ~~~java
    @ServerEndpoint(value = "/chat/{userName}")  // 这个B玩意会导致依赖注入没法注入
    @Slf4j
    @Component
    public class ChatEndPoint {
        private static final Map<String, Session> onLineUsers = new ConcurrentHashMap<>();

        @OnOpen
        public void onOpen(Session session, EndpointConfig config, @PathParam("userName") String userName) {
            // onOpen要做的有两件事，一件是将连接的该用户加入到在线序列中去，另一件事是向所有用户广播该用户已在线
            try {
                // 将session对象加入到在线用户的map集合中
                onLineUsers.put(userName, session);
                // 得到向所有在线成员广播的系统信息
                String message = "测试";
                // 向所有成员进行广播
                broadcastAllUserMessage(message);
            } catch (Exception e) {
                e.printStackTrace();
                log.error(e.toString());
            }
        }

        @OnMessage
        public void onMessage(String msg) throws Exception{
            Session session = onLineUsers.get("test");
            session.getBasicRemote().sendText(msg);
        }

        @OnClose
        public void onClose(CloseReason reason,Session session){
            log.info(reason.toString());
        }

        @OnError
        public void onError(Throwable e){
            log.info(e.toString());
        }

        private void broadcastAllUserMessage(String msg) throws Exception{
            // 遍历每个在线用户，向它们的客户端发送消息
            for (Map.Entry<String, Session> entry : onLineUsers.entrySet()) {
                Session userSession = entry.getValue();
                userSession.getBasicRemote().sendText(msg);
            }
        }
    }

  ~~~

---

### （六）Mybatis-Plus

+ [官网](https://baomidou.com)
+ MyBatis-Plus 是一个MyBatis的增强工具，在MyBatis的基础上只做增强不做改变，为简化开发、提高效率而生。

#### ①依赖

+ **引入MyBatis-Plus之后不要再次引入Mybatis相关依赖。以避免因版本差异导致的问题**。如果引了，那么大概率会报错
+ 从3.5.4开始，在没有使用mybatis-plus-boot-starter或mybatis-plus-spring-boot3-starter情况下，请自行根据项目情况引入mybatis-spring

~~~xml
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>
~~~

---

#### ②BaseMapper

+ [参考](https://baomidou.com/guides/data-interface/#mapper-interface)
+ BaseMapper是Mybatis-Plus提供的一个通用Mapper接口，它封装了一系列常用的数据库操作方法，包括增、删、改、查等。通过继承BaseMapper，开发者可以快速地对数据库进行操作，而无需编写繁琐的SQL语句
+ 我们的mapper接口通过继承BaseMapper接口来实现对该基础接口的继承，继承时需要制定接口的泛型，需要指定要操作的数据库表对应的实体类:

~~~java
    // User即数据库user表对应的实体类
    public interface UserMapper extends BaseMapper<User>{ ... }
~~~

+ BaseMapper提供了一系列的操作方法，参见[官网](https://baomidou.com/guides/data-interface/#mapper-interface)
+ [BaseMapper测试样例](../../源码/SpringBoot/SpringBoot-Mybatis-Plus/src/test/java/com/springboot/example/mybatisplus/MapperTest.java)

---

#### ③IService

+ IService 是MyBatis-Plus提供的一个通用Service层接口，它封装了常见的CRUD操作，包括插入、删除、查询和分页等。通过继承IService接口，可以快速实现对数据库的基本操作，同时保持代码的简洁性和可维护性
+ 我们可以让我们的Service接口继承该接口，来得到该接口定义的方法，再让接口实现类继承ServiceImpl类实现对IService内定义方法的实现，同时实现我们的Service接口来进行拓展:

~~~java

// IService的泛型指定数据库表对应的实体类对象
public interface UserService extends IService<User> {...}

// ServiceImpl的第一个泛型指定继承了BaseMapper的自定义Mapper类接口
// 第二个泛型指定数据库表对应的实体类对象
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {...}
~~~

+ [IService测试样例](../../源码/SpringBoot/SpringBoot-Mybatis-Plus/src/test/java/com/springboot/example/mybatisplus/ServiceTest.java)

---

#### ④常用注解

+ [参考](https://baomidou.com/reference/annotation/)

|注解|作用|属性|属性作用|备注|
|:---:|:---:|:---:|:---:|:---:|
|@TableName|指定实体类对应的数据库表名|value|指定实体类对应的数据库表名|无|
|^|^|keepGlobalPrefix|是否保持使用全局的表前缀|无|
|^|^|excludeProperty|指定在映射时需要排除的属性名|无|
|@TableId|标记实体类中的主键字段|value|指定实体类主键属性对应的数据库主键名，如果不设置，Mybatis-Plus将使用属性名作为主键名|无|
|^|^|type|指定主键的生成策略|无|
|@TableField|标记实体类中的非主键属性|value|指定实体类非主键属性对应的数据库字段名|无|
|@TableLogic|标记实体类中的属性作为逻辑删除字段|value|指定实体类属性对应的数据库逻辑删除字段名|无|
|@Version|标记实体类中的字段作为乐观锁版本号字段|>|略|无|
|@EnumValue|标记枚举类中的字段，指定在数据库中存储的枚举值|>|略|无|

---

#### ⑤常用配置

+ [参考](https://baomidou.com/reference/)

|配置|作用|值|备注|
|:---:|:---:|:---:|:---:|
|mybatis-plus.mapper-locations|指定mapper接口对应的mapper.xml文件的位置，默认为`classpath:/mapper/**/*.xml`|classpath:xxxx|无|
|mybatis-plus.configuration.map-underscore-to-camel-case|是否开启小驼峰命名映射，默认开启|布尔值|无|
|mybatis-plus.configuration.log-impl|指定对应日志在SQL执行时进行输出，默认没有配置|日志类全路径|无|
|mybatis-plus.type-aliases-package|指定实体类别名的包类路径|路径，一般为`com.example.xxx.pojo`|无|

---

#### ⑥插件

+ Mybatis_plus支持一些好用的插件，可以通过配置类来进行导入:

~~~java

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor(){
        MybatisPlusInterceptor mybatisPlusInterceptor=new MybatisPlusInterceptor();
        mybatisPlusInterceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));  // 添加分页插件
        mybatisPlusInterceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());  // 添加乐观锁插件
        return mybatisPlusInterceptor;
    }
~~~

+ 其他插件见[官网](https://baomidou.com/plugins/)

---

#### ⑦多数据源

+ [官网介绍](https://baomidou.com/guides/dynamic-datasource/)
+ [github官方](https://github.com/baomidou/dynamic-datasource)
+ 顾名思义，就是对多个数据源的支持
+ 首先要导入新的依赖:

~~~xml
    <!-- SpringBoot1和SpringBoot2用这个 -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
        <version>${version}</version>
    </dependency>

    <!-- SpringBoot3用这个，用上面的会报错 -->
    
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>dynamic-datasource-spring-boot3-starter</artifactId>
        <version>${version}</version>
    </dependency>

~~~

+ 在[配置文件](../../源码/SpringBoot/SpringBoot-Mybatis-Plus/src/main/resources/application.properties)中进行相关配置
+ 在[Service类](../../源码/SpringBoot/SpringBoot-Mybatis-Plus/src/main/java/com/springboot/example/mybatisplus/service/impl/MasterUserServiceImpl.java)中写上@DS注解，**该注解用于指定所使用的数据源**
+ 进行[测试](../../源码/SpringBoot/SpringBoot-Mybatis-Plus/src/test/java/com/springboot/example/mybatisplus/DynamicDatasourceTest.java)

---

### （七）Swagger

#### ①快速入门

+ 导入依赖

~~~xml
  <!-- Swagger3 调用方式 http://你的主机IP地址:5555/swagger-ui/index.html -->
  <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  </dependency>
~~~

+ 添加配置类:

~~~java
    @Configuration
    public class SwaggerConfig {
        @Bean
        public GroupedOpenApi PayApi() {
            // 这个group里面指定的描述信息需要与@Tag的name属性指定的描述信息一致，其controller中的方法才会被加入该组内的测试中去
            return GroupedOpenApi.builder().group("支付微服务模块").pathsToMatch("/pay/**").build();
        }
        @Bean
        public GroupedOpenApi OtherApi() {
            return GroupedOpenApi.builder().group("其它微服务模块").pathsToMatch("/other/**", "/others").build();
        }
    }

~~~

+ 根据注解在Controller类、Controller方法和实体类的类和属性上添加注解
+ 访问`http://localhost:<port>/swagger-ui/index.html`进行测试

---

#### ②常用注解

|注解|作用|主要作用范围|备注|
|:---:|:---:|:---:|:---:|
|@Tag|声明Controller类的作用，与配置类内的配置相对应|类|无|
|@Operation|描述方法作用|方法|无|
|@Schema|描述实体类作用，以及它各个属性的作用|类、属性|name属性会修改swagger初始发送的json的key,用title才是描述作用|
|@Parameter|描述参数作用|方法|无|
|@Parameters|描述参数作用|方法|无|
|@ApiResponse|描述响应状态码等|方法|无|

---

## 四、部署

### （一）部署SpringBoot项目

+ 下面展示使用阿里云进行部署的步骤:
  + 首先在确定无误后，运行`mvn package`得到项目jar包
  + 使用Xftp将对应文件放到对应的阿里云服务器中
  + 接下来安装Java环境，直接在本地下下来，然后用Xftp传过去，注意需要下载linux版本的JDK，不是Windows版本的JDK
  + 使用`tar -zxvf xxx.gz`解压
  + `vim /etc/profile`打开配置文件，在文件下面配置:

    ~~~profile
        export JAVA_HOME=/home/study/java/jdk-17.0.11  # 这个JAVA_HOME要写自己的linux服务器上面的java的实际地址
        export CLASSPATH=$JAVA_HOME/lib/
        export PATH=$PATH:$JAVA_HOME/bin
        export PATH JAVA_HOME CLASSPATH
    ~~~

  + 执行`source /etc/profile`来进行配置文件的重新加载，然后运行`java -version`来查看是否配置好了
  + 接下来使用`java -jar xxx.jar`来使项目启动，但是**该种部署方式会导致终端被java进程占用，无法进行后续操作，因此不推荐**。如果使用该方式，那么`Ctrl+C`回到终端时，服务也会同步停止运行
  + 如果想使用其他方式启动，可以使用:
    + `nohup java -jar xxxx.jar >/dev/null 2>&1 &`来使其在后台进行运行。如果想停止，先使用`ps -ef | grep java`获取Java项目的pid,接下来`kill -9 pid`来杀死进程
    + [参考](https://blog.csdn.net/Jason_We/article/details/113663318)
  + 如果在本地测试无误，但是部署上去之后请求报错`net::ERR_CONNECTION_REFUSED`，考虑是不是阿里云的安全组未开放端口

---

### （二）部署MySQL数据库

+ 关于MySQL数据库在linux上的安装详见[MySQL笔记](../../../../数据库/笔记/MySQL笔记.md)
+ 我们首先需要保证MySQL数据库是能被连接到的，因此需要:
  + 关闭防火墙，或者防火墙放行端口，以及允许外部访问
  + 如果是云服务器，还需要设置安全组，也要放行端口
  + 数据库需要创建出能够建立连接的对应用户，也就是**host为连接方ip(是连接方ip，不是本服务器ip)**的用户，且拥有能够满足业务的权限
+ 实际上就这么点，但是我们需要保证我们的Java程序能够访问到，因此这里摆提供一些SpringBoot的配置:
  + 数据库连接的url格式为:`jdbc:{mysql\|oracle}://{ip地址\|主机名}:端口号/数据库名[?key1=value1&key2=value2&....(可选信息)]`

~~~properties
    # 配置数据库
    spring.datasource.username=root
    spring.datasource.url=jdbc:mysql://8.130.44.112:3306/chat
    spring.datasource.password=123456
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
~~~

---


## 五、新特性

### （一）Problemdetails

+ Spring官方根据[RFC7807](https://www.rfc-editor.org/rfc/rfc7807)的规范，添加了对媒体类型`application/problem+json`返回的支持:
+ 为此，SpringBoot特地在WebMvcAutoConfiguration中加入了ProblemDetailsExceptionHandler对象
  + 想使用该特性，需要在配置文件中配置`spring.mvc.problemdetails.enabled`属性，并置为true
  + 这里@ConditionalOnProperty明示的很明显

~~~java
    @Configuration(proxyBeanMethods = false)
    @ConditionalOnProperty(
        prefix = "spring.mvc.problemdetails",
        name = {"enabled"},
        havingValue = "true"
    )
    static class ProblemDetailsErrorHandlingConfiguration {
        ProblemDetailsErrorHandlingConfiguration() {
        }

        @Bean
        @ConditionalOnMissingBean({ResponseEntityExceptionHandler.class})
        @Order(0)
        ProblemDetailsExceptionHandler problemDetailsExceptionHandler() {
            return new ProblemDetailsExceptionHandler();
        }
    }
~~~

+ ProblemDetailsExceptionHandler继承自ResponseEntityExceptionHandler，在该类中，SpringBoot默认处理了一些可能的异常:

~~~java
    @ExceptionHandler(
        {
            HttpRequestMethodNotSupportedException.class, 
            HttpMediaTypeNotSupportedException.class, 
            HttpMediaTypeNotAcceptableException.class, 
            MissingPathVariableException.class, 
            MissingServletRequestParameterException.class, 
            MissingServletRequestPartException.class, 
            ServletRequestBindingException.class, 
            MethodArgumentNotValidException.class, 
            HandlerMethodValidationException.class, 
            NoHandlerFoundException.class, 
            NoResourceFoundException.class, 
            AsyncRequestTimeoutException.class, 
            ErrorResponseException.class, 
            MaxUploadSizeExceededException.class, 
            ConversionNotSupportedException.class, 
            TypeMismatchException.class, 
            HttpMessageNotReadableException.class, 
            HttpMessageNotWritableException.class, 
            MethodValidationException.class, 
            BindException.class
        }
    )
    @Nullable
    public final ResponseEntity<Object> handleException(Exception ex, WebRequest request) throws Exception {
        if (ex instanceof HttpRequestMethodNotSupportedException subEx) {
            return this.handleHttpRequestMethodNotSupported(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof HttpMediaTypeNotSupportedException subEx) {
            return this.handleHttpMediaTypeNotSupported(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof HttpMediaTypeNotAcceptableException subEx) {
            return this.handleHttpMediaTypeNotAcceptable(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof MissingPathVariableException subEx) {
            return this.handleMissingPathVariable(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof MissingServletRequestParameterException subEx) {
            return this.handleMissingServletRequestParameter(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof MissingServletRequestPartException subEx) {
            return this.handleMissingServletRequestPart(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof ServletRequestBindingException subEx) {
            return this.handleServletRequestBindingException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof MethodArgumentNotValidException subEx) {
            return this.handleMethodArgumentNotValid(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof HandlerMethodValidationException subEx) {
            return this.handleHandlerMethodValidationException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof NoHandlerFoundException subEx) {
            return this.handleNoHandlerFoundException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof NoResourceFoundException subEx) {
            return this.handleNoResourceFoundException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof AsyncRequestTimeoutException subEx) {
            return this.handleAsyncRequestTimeoutException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof ErrorResponseException subEx) {
            return this.handleErrorResponseException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else if (ex instanceof MaxUploadSizeExceededException subEx) {
            return this.handleMaxUploadSizeExceededException(subEx, subEx.getHeaders(), subEx.getStatusCode(), request);
        } else {
            HttpHeaders headers = new HttpHeaders();
            if (ex instanceof ConversionNotSupportedException theEx) {
                return this.handleConversionNotSupported(theEx, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
            } else if (ex instanceof TypeMismatchException theEx) {
                return this.handleTypeMismatch(theEx, headers, HttpStatus.BAD_REQUEST, request);
            } else if (ex instanceof HttpMessageNotReadableException theEx) {
                return this.handleHttpMessageNotReadable(theEx, headers, HttpStatus.BAD_REQUEST, request);
            } else if (ex instanceof HttpMessageNotWritableException theEx) {
                return this.handleHttpMessageNotWritable(theEx, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
            } else if (ex instanceof MethodValidationException subEx) {
                return this.handleMethodValidationException(subEx, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
            } else if (ex instanceof BindException theEx) {
                return this.handleBindException(theEx, headers, HttpStatus.BAD_REQUEST, request);
            } else {
                throw ex;
            }
        }
    }
~~~

---

### （二）函数式Web

+ Spring官方认为控制层与路由映射耦合在一起不是很好，企图降低耦合
+ 于是Spring在5.2以后推出了新的请求处理流程:
  + 在配置文件中提供一个方法:`public RouterFunction<ServerResponse> [自定义方法名]()`，并让该方法被@Bean注解注释
  + 在里面进行路由的映射以及请求方法的分配:
+ [函数式Web样例](../../源码/SpringBoot/SpringBootThymeleaf/src/main/java/com/springboot/example/springbootthymeleaf/config/MyConfig.java)

---

## 配置汇总

### （一）配置项汇总

|分组|配置|作用|值|备注|
|:---:|:---:|:---:|:---:|:---:|
|**常用**|server.port|指定端口|默认8080|无|
|^|spring.application.name|指定项目名称|字符串|不知道有什么用，**它和前端进行请求时需要带的上下文路径是不一样的**|
|**调试**|debug|开启调试模式，终端会打印开启了哪些自动配置|布尔值，默认为false|无|
|**日志**|logging.level.{root\|sql\|web\|类的全类名\|自定义组名}|指定全局/sql组/web组/类/自定义组的日志级别|字符串值|无|
|^|logging.group.自定义组名|将多个类划分为一个组|全类名|无|
|^|logging.file.name|指定日志输出的文件|文件路径|也可以写路径，如果是相对路径，那么是相对于项目所在目录的|
|^|loggging.file.path|指定日志输出的路径|文件路径|优先级没有logging.file.name高|
|^|logging.logback.rollingpolicy.file-name-pattern|指定日志归档的命名格式，默认值是`${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz`|配置规则|从配置项可以看出，只有使用Logback才能使用该配置|
|^|logging.logback.rollingpolicy.clean-history-on-start|应用启动前是否清除以前日志文件|布尔值，默认为false|^|
|^|logging.logback.rollingpolicy.max-file-size|指定每个日志文件的最大大小|数值|^|
|^|logging.logback.rollingpolicy.total-size-cap|指定日志文件总大小超过指定大小后，就删除旧的日志文件|大小，默认为0B|^|
|^|logging.logback.rollingpolicy.max-history|日志文件保存的最大天数|数值，默认7，单位天|^|
|**静态资源**|spring.mvc.static-path-pattern|用来**设置匹配的前端请求静态资源的路径**|字符串值|无|
|^|spring.mvc.webjars-path-pattern|用来**设置匹配的前端请求webjars资源的路径**|字符串值|无|
|^|spring.web.resources.static-locations|配置用来设置后端处理静态资源要寻找的目录，**它会覆盖掉SpringBoot默认配置的四个路径**|字符串值|**针对webjars的路径匹配依然有效，因为根据源码，webjars相关的路径匹配被单独配置了，而该项配置与webjars的路径匹配没有关系**|
|^|spring.web.resources.add-mappings|开启静态资源映射|默认为true|无|
|^|spring.web.resources.cache.period|配置浏览器使用资源的大概时间|数值，单位秒|**如果配置了控制项，该配置会被覆盖**|
|^|spring.web.resources.cache.use-last-modified|配置是否在浏览器找服务器请求资源前，先发送请求确认资源是否发生了更改|布尔值|无|
|^|spring.web.resources.cache.cachecontrol.max-age|配置浏览器使用缓存的最大时间，在此期间，浏览器会使用缓存加载资源|数值，单位秒|无|
|^|spring.web.resources.cache.cachecontrol.cache-public|设置是否共享缓存|布尔值|无|
|**路径匹配**|spring.mvc.pathmatch.matching-strategy|设置路径匹配原则|无|
|^|server.servlet.context-path|设置项目的上下文路径|路径字符串|详见[问题汇总](问题汇总.md)|
|**内容协商**|spring.mvc.contentnegotiation.favor-parameter|设置SpringBoot开启基于路径参数的内容协商|布尔值，默认false|无|
|^|spring.mvc.contentnegotiation.parameter-name|指定通过参数内容协商传递返回类型的参数名|字符串值|无|
|^|spring.mvc.contentnegotiation.media-types.{type}=aaa/bbb|type是我们给这个媒体类型起的名字，这个名字是用来路径传参的时候携带的值，比如`spring.mvc.contentnegotiation.media-types.yaml=text/yaml`,那么路径传参的时候请求参数就是`type=yaml`|媒体类型|无|
|Thymeleaf|spring.thymeleaf.prefix|指定thymeleaf的匹配前缀|默认是`classpath:/templates/`|无|
|^|spring.thymeleaf.suffix|指定thymeleaf的匹配后缀|默认是`.html`|无|
|^|spring.thymeleaf.check-template|在响应前确认对应模板是否存在，不存在会报错|布尔值，默认为true|无|
|^|spring.thymeleaf.check-template-location|在响应前确认模板所在路径是否存在，不存在会报错|布尔值，默认为true|无|
|^|spring.thymeleaf.cache|如果浏览器已经缓存了该模板，那么就让浏览器用缓存|布尔值，默认为true|无|
|**国际化**|spring.messages.basename|指定国际化默认的配置文件路径|路径|不仅要指定路径，还要指定文件的前缀|
|^|spring.messages.encoding|指定国际化默认的配置文件的解码方式|编码格式|无|
|**错误处理**|server.error.path|设定默认的错误视图寻找路径|默认值为`/error`|无|
|^|server.error.include-stacktrace|是否允许报错信息携带异常堆栈信息|always:总是携带<br>on_param:不知道干嘛的<br>never:默认值，从不携带|无|
|^|server.error.include-binding-errors|是否允许携带errors属性|always:总是携带<br>on_param:不知道干嘛的<br>never:默认值，从不携带|无|
|^|server.error.include-exception|是否允许携带异常全类名|true/false，默认为false|无|
|^|server.error.include-message|是否允许携带异常描述|always:总是携带<br>on_param:不知道干嘛的<br>never:默认值，从不携带|无|
|^|spring.mvc.problemdetails.enabled|是否允许返回`application/problem+json`格式的数据|布尔值，默认false|无|
|**数据库**|spring.datasource.url|指定连接的数据库地址|地址值|无|
|^|spring.datasource.username|指定数据库用户名|字符串|无|
|^|spring.datasource.password|指定数据库密码|字符串|无|
|^|spring.datasource.driver-class-name|指定数据库驱动全类名|全类名|无|
|^|spring.datasource.type|指定连接池全类名|全类名|无|
|**Mybatis**|mybatis.configuration.map-underscore-to-camel-case|开启Mybatis驼峰命名映射|布尔值，默认为true(不开启)|无|
|^|mybatis.mapper-locations|指定mapper对应的xml文件路径映射|路径映射，一般为`classpath:mapper/*.xml`|无|
|^|mybatis.type-aliases-package|指定实体类别名的包类路径|路径，一般为`com.example.xxx.pojo`|无|
|**Mybatis-Plus**|mybatis-plus.mapper-locations|指定mapper接口对应的mapper.xml文件的位置，默认为`classpath:/mapper/**/*.xml`|classpath:xxxx|无|
|^|mybatis-plus.configuration.map-underscore-to-camel-case|是否开启小驼峰命名映射，默认开启|布尔值|无|
|^|mybatis-plus.configuration.log-impl|指定对应日志在SQL执行时进行输出，默认没有配置|日志类全路径|无|
|^|mybatis-plus.type-aliases-package|指定实体类别名的包类路径|路径，一般为`com.example.xxx.pojo`|无|
|**banner**|spring.banner.location|指定读取的banner文件|路径|无|
|^|spring.main.banner-mode|指定banner的显示模式|off:不显示<br>log:使用日志显示<br>console:控制台输出|无|
|**配置隔离**|spring.profiles.active|指定要开启的环境|一个或多个环境名|需要动态切换的环境使用它指定|
|^|spring.profiles.default|指定默认的环境|环境名|默认是default|
|^|spring.profiles.include|指定包含的环境|一个或多个环境名|一般把基础的环境，也就是无论什么情况都用到的环境加入到这里面|
|^|spring.profiles.group.{groupName}|配置环境组,groupName是组的名称|一个或多个环境名|无|
|**文件上传**|spring.servlet.multipart.enabled|开启文件上传功能，默认就是开启的|布尔值|无|
|^|spring.servlet.multipart.max-file-size|限制单文件上传的最大大小|格式:`xxMb`|无|
|^|spring.servlet.multipart.max-request-size|限制单次请求上传的文件总量大小|格式:`xxMb`|无|
|**Redis**|spring.data.redis.host|配置redis所在的服务器ip|ip号|无|
|^|spring.data.redis.port|配置redis所使用的端口号|端口号|无|
|^|spring.data.redis.password|配置连接redis需要的密码|字符串|无|
|^|spring.data.redis.cluster.max-redirects|设置最大重定向次数|数值|无|
|^|spring.data.redis.lettuce.pool.max-active|设置最大连接池最大数量|数值|
|^|spring.data.redis.lettuce.pool.max-wait|连接池阻塞的最大等待时间|`xxxms`，如:`-1ms`|
|^|spring.data.redis.lettuce.pool.max-idle|连接池中的最大空闲连接|数值|
|^|spring.data.redis.lettuce.pool.min-idle|连接池中的最小空闲连接|数值|
|^|spring.data.redis.cluster.nodes|要连接的集群节点|以`<host>:<port>`的方式提供，如果有多个，用逗号隔开，例:`8.130.44.112:6381,8.130.44.112:6382`|无|
|**jackson**|spring.jackson.date-formate|指定自定义的时间格式|[参考](../文件/图片/Java图片/自定义日期格式规范表.png)|无|
|^|spring.jackson.time-zone|指定时区|格式:`GMT+<number>`,number就是时区的具体值|无|
|**SpringCloud-Consul**|spring.cloud.consul.host|指定consul服务所在的host|默认为localhost|无|
|^|spring.cloud.consul.port|指定consul服务所占用的端口|默认为8500|无|
|^|spring.cloud.consul.discovery.service-name|指定对应微服务模块服务发现的名称|一般与spring.application.name保持一致|无|
|**SpringCloud-OpenFeign**|spring.cloud.openfeign.client.config.default.connect-timeout|设置连接的超时时间，单位毫秒|默认为2s|无|
|^|spring.cloud.openfeign.client.config.default.read-timeout|设置连接完成后，等待服务的超时时间，单位毫秒|默认60s|无|
|^|spring.cloud.openfeign.client.config.<serviceName>.read-timeout|设置更细粒度的相关配置，serviceName表示对应的服务模块在Consul上注册的注册名|单位毫秒|无|
|^|spring.cloud.openfeign.httpclient.hc5.enabled|启用httpclient5配置，用以替代OpenFeign默认使用的没有连接池、性能和效率比较低的JDK自带的HttpURLConnection|布尔值|无|
|^|spring.cloud.openfeign.compression.request.enabled|开启请求压缩|布尔值|无|
|^|spring.cloud.openfeign.compression.request.mime-types|设置要进行压缩的请求参数类型|mime类型，如果有多个用逗号隔开|无|
|^|spring.cloud.openfeign.compression.request.min-request-size|请求大小超过该值时，进行压缩|数值|无|
|^|spring.cloud.openfeign.compression.response.enabled|开启响应压缩|布尔值|无|
|^|logging.level.<refrence>|设置日志级别（这个是SpringBoot的日志输出的日志级别，不是OpenFeign的日志级别）|只能设置为`debug`|无|


+ 改进版配置项汇总

|分组|配置项|参数|作用|值|备注|
|:---:|:---:|:---:|:---:|:---:|
|**SpringCloud-Resilience4j**|resilience4j.circuitbreaker.configs.<configKey>.failure-rate-threshold|configKey:自定义设置的名称|设置当多少比例（百分比）的请求失败时，进行服务熔断。|数值，如设置为50表示请求失败比例达到50%就进行服务熔断|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.sliding-window-type|^|设置进行熔断判断的模式|`TIME_BASED`:按一定时间进行计算<br>`COUNT_BASED`:按一定数量进行计算|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.slow-call-duration-threshold|^|设置慢调用的评判标准，即一次请求执行超过多长时间算慢调用|例:`5s`|**慢调用是执行慢，但是执行成功了，不能算进请求失败里**<br>`TIME_BASED`模式下才生效|
|^|resilience4j.circuitbreaker.configs.<configKey>.slow-call-rate-threshold|^|设置当慢调用占单位时间内请求的多少比例时，进行服务熔断|数值，如设置为50表示慢调用比例达到50%就进行服务熔断|`TIME_BASED`模式下才生效|
|^|resilience4j.circuitbreaker.configs.<configKey>.sliding-window-size|^|设置滑动窗口大小，如果是`TIME_BASED`模式，那么该值表示每隔多长时间（单位秒）就进行一次熔断判断，如果是`COUNT_BASED`模式，该值表示距离上一次判断后，请求累计到达多少次时就进行一次熔断判断|数值|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.minimum-number-of-calls|^|设置进行熔断判断的最小样本|数值|一般与上面的sliding-window-size配置保持一致|
|^|resilience4j.circuitbreaker.configs.<configKey>.permitted-number-of-calls-in-half-open-state|^|设置断路器转换到半开状态时放行的请求数|数值|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.automatic-transition-from-open-to-half-open-enabled|^|是否启用让断路器在开启后，自动过渡到半开状态。如果设置为false，那么就是在该服务收到调用才尝试过渡|布尔值|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.wait-duration-in-open-state|^|设置断路器到达OPEN状态时间隔多长时间转为HALF_OPEN状态|例:`5s`|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.record-exceptions|^|如果请求执行时出现的异常在该设置下的异常集合内，会被断路器认定为一次请求失败|异常的全类名|无|
|^|resilience4j.circuitbreaker.configs.<configKey>.ignore-exceptions|如果请求执行时出现的异常在该设置下的异常集合内，不会被断路器认定为一次请求失败|^|^|
|^|resilience4j.circuitbreaker.instances.<serviceName>.base-config|serviceName:服务模块在Consul上面所注册的名字|指定该服务模块所遵循的Resilience设置集|即上面的`configKey`|无|
|^|resilience4j.thread-pool-bulkhead.configs.<configKey>.core-thread-pool-size|configKey:自定义设置的名称|设置线程池的核心线程的数量|数值|无|
|^|resilience4j.thread-pool-bulkhead.configs.<configKey>.max-thread-pool-size|^|设置线程池最大的线程数量|数值|无|
|^|resilience4j.thread-pool-bulkhead.configs.<configKey>.queue-capacity|^|设置线程满了以后，承载后续请求的队列容量|数值|无|
|^|resilience4j.bulkhead.configs.default.max-concurrent-calls|^|设置该服务模块允许并发执行的最大数量|数值|无|
|^|resilience4j.bulkhead.configs.default.max-wait-duration|并发数达到上限时，再有请求来，若达到该值，那么自动进行服务降级处理|例:`2s`|无|
|^|resilience4j.thread-pool-bulkhead.instances.<serviceName>.base-config|serviceName:服务模块在Consul上面所注册的名字|指定该服务模块所遵循的Resilience设置集|即上面的`configKey`|无|


---

### （二）注解汇总

|分组|注解|作用|主要作用范围|备注|
|:---:|:---:|:---:|:---:|:---:|
|**项目启动**|@SSpringBootApplication|声明对应类为配置类并自动配置|类|无|
|**组件注册**|@Configuration|声明对应类为配置类|类|无|
|^|@SpringBootConfiguration|声明对应类为SpringBoot项目的配置类|类|其实跟上面的注解没有区别|
|^|@ServletComponentScan|配置扫描的包，使配置的包路径下的被@WebServlet、@WebFilter注解作用的类在IOC容器初始化时生成一个实例并加入IOC容器对象|类|无|
|^|@Service|^|作用于Service层|无|
|^|@Controller|^|作用于Controller层|无|
|^|@Repository|^|作用在Dao层|无|
|^|@Bean|使方法返回值作为bean加入到IOC容器内|方法|无|
|^|@Scope|声明该类型的bean是单实例还是多实例|方法|无|
|^|@Controller/@Service/@Repository/@Conponent|声明对应类属于控制层/服务层/DAO层/其它层，并将其纳入IOC容器管理|类|无|
|^|@Import|指定对应类受IOC容器管理|类|一般用于将第三方包下的类纳入IOC容器管理|
|^|@ComponentScan|开启组件扫描|类|作用于配置类上|
|^|@Lazy|指定组件懒加载|配置类中的bean方法|^|
|^|@DependOn|指定依赖加载对象|无|^|
|^|@PreDestroy|指定销毁方法|^|该注解来源于`jakarta`包|
|^|@PostConstruct|指定初始化方法|^|^|
|^|@Value|注入基本数据类型对象|类属性、方法属性|无|
|^|@Autowared|根据byType模式匹配对应的引用数据类型对象并注入|^|1.该注解无法自动装配JDK自带的数据类型<br>**不能作用于测试类**|
|^|@Qualifier|使自动装配按照byName的方式匹配，且依据的是该注解内指定的name值进行匹配|^|无|
|^|@Resource|依据 指定的name -> byName -> byType的模式依次匹配对应的引用数据类型对象并注入|^|1.该注解来源于`jakarta`包<br>2.**不能作用于测试类**|
|**请求处理**|@RequestMapping|指定映射路径与支持的请求类型等|类、方法|无|
|^||@{Get\|Post\|Put\|Delete\|Patch}Mapping|指定不同请求类型的映射路径|^|无|
|^|@ControllerAdvice|声明异常处理类|类|无|
|^|@RestControllerAdvice|@ControllerAdvice+@ResponseBody|^|无|
|^|@CrossOrigin|解决跨域问题|类与方法|无|
|^|@RequestParam|接收get参数和请求体参数|方法属性|无|
|^|@PathVariable|接收路径参数|^|无|
|^|@RequestBody|接收请求体参数，并将其中的属性映射为方法中接收前端请求参数的属性对应的引用数据类型对象|^|**它无法接收同名的param参数**|
|^|@Cookie|得到Cookie携带的指定值|^|无|
|^|@SessionAttribute|得到session内的指定值|^|无|
|^|@RequestHeader|读取请求头内的指定字段的值|^|无|
|^|@Validated|针对实体类对象进行校验|^|无|
|^|@ResponseBody|使方法返回值受对应转换器处理并不通过视图解析器解析|方法|无|
|**异常处理**|@ControllerAdvice|声明异常处理类|类|无|
|^|@RestControllerAdvice|@ControllerAdvice+@ResponseBody|类|无|
|**条件注解**|@ConditionalOnClass|若类路径下存在该类，那么触发指定行为|类/方法|触发指定行为需要利用其他注解实现，如加入IOC容器需要@Bean注解|
|^|@ConditionalOnMissingClass|若类路径下不存在该类，那么触发指定行为|^|^|
|^|@ConditionalOnBean|若IOC容器内存在指定的bean,那么触发指定行为|^|^|
|^|@ConditionalOnMissingBean|如果容器中不存在这个Bean（组件）,那么触发指定行为|^|^|
|**属性绑定**|@ConfigurationProperties|声明组件的属性和配置文件内key的前缀项以进行项绑定|类|该注解生效必须**使作用类被@Component及相关注解作用或被配置类的@EnableConfigurationProperties指定**，且**对应的实体类需要有getter和setter方法**<br>该注解生效的时机貌似是bean创建时检查|
|^|@EnableConfigurationProperties|指定某些类是属性绑定类|类|应作用于配置类|
|^|@PropertySource|读取外部指定路径的properties文件内容|类|无|
|**Jackson**|@JacksonXmlRootElement|声明对应类可被转换为xml格式|类|无|
|**日志**|@Slf4j|被该注解作用的类中的方法内，都默认可以得到一个实现了SLF4J日志门面的日志对象|类|该注解来自于Lombok|
|**Mybatis**|@MapperScan|指定mapper接口所在的包，用于创建mapper的代理对象|类|无|
|^|@Param|指定mapper最终能看到的参数名称|方法参数|无|
|^|@Alias|指定类在mapper文件中的别名|数据库对应实体类|无|
|**配置隔离**|@Profile|在开启指定环境后，类或方法上的注解才生效|类或方法|无|
|**junit**|@SpringBootTest|执行测试时会启动SpringBoot项目进行测试|类|无|
|^|其它相关Junit注解详见[其它依赖笔记](其它依赖笔记.md)|
|**自定义starter**|@ConfigurationProperties|设置Properties配置类的一些常见配置，如对应的配置文件前缀|类|无|
|**Swagger**|@Tag|声明Controller类的作用，与配置类内的配置相对应|类|无|
|^|@Operation|描述方法作用|方法|无|
|^|@Schema|描述实体类作用，以及它各个属性的作用|类、属性|name属性会修改swagger初始发送的json的key,用title才是描述作用|
|^|@Parameter|描述参数作用|方法|无|
|^|@Parameters|描述参数作用|方法|无|
|^|@ApiResponse|描述响应状态码等|方法|无|

+ 改进版汇总表

|分组|注解|作用|参数|参数作用|参数值|注解作用范围|备注|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|**jackson**|@JsonFormat|指定该属性返回给前端时要转换的格式|pattern|自定义格式|字符串|属性|无|
|^|^|^|timezone|指定时间的时区|格式:`GMT+<number>`|属性|无|
|**SpringCloud-Consul**|@EnableDiscoveryClient|开启微服务模块的服务发现|>|>|无|类|无|
|**SpringCloud-LoadBalancer**|@LoadBalanced|使RestTemplate对象支持负载均衡|>|>|无|方法、参数、属性|无|
|**SpringCloud-OpenFeign**|@FeignClient|声明接口为OpenFeign接口API|value|指定该接口API对应的微服务模块在Consul上面的注册名，从而指向该模块|注册名|类|无|
|^|@EnableFeignClients|开启OpenFeign功能|>|>|无|类|无|
|**SpringCloud-Resilience4j**|@CircuitBreaker|使对应方法被断路器监听，并在出现问题时可以触发服务熔断和服务降级|name|配置断路器要监听的服务模块的调用，即该值对应的服务模块的调用行为会被断路器监听，并在出现问题时执行服务熔断和服务降级|对应服务模块在Consul上面的注册名|方法|无|
|^|^|^|fallback|指定服务降级要调用的fallback方法|fallback方法的名称（字符串）|^|^|
|^|@Bulkhead|使对应方法能够经过舱壁隔离处理|name|该值对应的服务模块的调用行为会被断路器监听，并在出现问题时执行服务熔断和服务降级|对应服务模块在Consul上面的注册名|方法|无|
|^|^|^|fallback|指定服务降级要调用的fallback方法|fallback方法的名称（字符串）|^|^|
|^|^|^|type|舱壁隔离的方式|信号量(`Bulkhead.Type.SEMAPHORE`)和线程池(`Bulkhead.Type.THREADPOOL`)|^|^|



+ [组件注册注解样例](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/java/com/springboot/example/springbootinitializrdemo/config/MyConfig.java)
+ [条件注解样例](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/java/com/springboot/example/springbootinitializrdemo/config/MyConfig.java)
+ [实体类属性绑定样例](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/java/com/springboot/example/springbootinitializrdemo/pojo/Person.java)
+ [配置类属性绑定样例](../../源码/SpringBoot/SpringBootInitializrDemo/src/main/java/com/springboot/example/springbootinitializrdemo/config/MyConfig.java)

---