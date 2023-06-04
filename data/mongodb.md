# mongodb 初体验-window 篇

## 安装

[下载地址](https://www.mongodb.com/try/download/community-kubernetes-operator)

MongoDB 版本命名规则：x.y.z

y 为奇数：开发版 4.1.2

y 为偶数：稳定版 4.0.12 （推荐）

**注：以下介绍均已 4.4.22 为例**

## 配置环境变量

1. 在桌面上右键单击“计算机”，然后选择“属性”。
2. 在左侧的菜单中，单击“高级系统设置”。
3. 在“系统属性”窗口中，单击“环境变量”按钮。
4. 在“用户变量”或“系统变量”列表中，找到名为 PATH 的变量，然后单击“编辑”按钮。
5. 在“编辑用户变量”或“编辑系统变量”窗口中，单击“新建”按钮并输入 MongoDB 安装目录的路径。例如：D:\study\tools\mongodb-win32-x86_64-windows-4.4.22\bin。
6. 确认所有更改，然后重新启动你的计算机使更改生效。

## 启动

### 命令行启动

1. 在安装目录下创建数据储 data 文件夹，在 data 下创建 db 文件夹用于存储数据库
2. 进入 mongodb 安装目录下的 bin 文件夹
3. 在地址栏输入 cmd 回车，在弹出的窗口中输入以下命令行启动
   ```
   mongod --dbpath=..\data\db
   ```

### 配置文件启动

1. 在安装目录下创建 conf 文件夹
2. 在 conf 下新建 mongod.conf

   ```powershell
   # mongod.conf

   # 设置数据库存储目录
   storage:
     dbPath: /var/lib/mongodb

   # 设置日志文件存储目录
   systemLog:
     destination: file
     path: /var/log/mongodb/mongod.log
     logAppend: true

   # 允许远程连接
   net:
     bindIp: 127.0.0.1,111.222.333.444 # 允许本地和指定 IP 地址连接
     port: 27017

   # 开启安全认证
   #security:
   #  authorization: enabled

   # 开启复制集
   #replication:
   #  replSetName: rs0

   # 启用 WiredTiger 引擎的 snappy 压缩算法
   #setParameter:
   #  wireObjectCheck: true

   ```

3. 命令行启动

   ```powershell
   mongod -f ..\conf\mongod.conf
   ```

## 连接

**注：启动窗口不能关闭**

### 命令行连接

```powershell
mongo
```

连接测试

```powershell
show dbs
```

展示 admin、config、local 三个库表示连接成功！

### 三方软件连接

#### compass

[下载地址](https://www.mongodb.com/try/download/compass)

#### NoSQLBooster

[下载地址](https://nosqlbooster.com/downloads)

## 常用命令

### Shell 版

#### 显示所有数据库

```powershell
show dbs
```

#### 显示当前数据库

```powershell
db
```

#### 切换数据库

```powershell
use <dbName>
```

#### 访问其他数据库

```powershell
db.getSiblingDB('<dbName>')
```

#### 插入

##### 单条（若该集合不存在，则创建该集合）

```powershell
db.collection.insertOne(
   <document>,
   {
      writeConcern: <document> // 表达书面关切的文件。省略使用默认的写关注
   }
)
```

##### 多条（若该集合不存在，则创建该集合）

```
db.collection.insertMany(
   [ <document 1> , <document 2>, ... ],
   {
      writeConcern: <document>,
      ordered: <boolean> // 一个布尔值，指定mongod实例应执行有序插入还是无序插入。默认为true
   }
)
```

##### 一个或多个（若该集合不存在，则创建该集合）

```
db.collection.insert(
   <document or array of documents>,
   {
     writeConcern: <document>,
     ordered: <boolean>
   }
)
```

##### 其他方式插入

- [`db.collection.update()`](https://mongodb.net.cn/manual/reference/method/db.collection.update/#db.collection.update 'db.collection.update（）')与该 选项一起使用时。`upsert: true`
- [`db.collection.updateOne()`](https://mongodb.net.cn/manual/reference/method/db.collection.updateOne/#db.collection.updateOne 'db.collection.updateOne（）')与该选项一起使用时。`upsert: true`
- [`db.collection.updateMany()`](https://mongodb.net.cn/manual/reference/method/db.collection.updateMany/#db.collection.updateMany 'db.collection.updateMany（）')与该选项一起使用时。`upsert: true`
- [`db.collection.findAndModify()`](https://mongodb.net.cn/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify 'db.collection.findAndModify（）')与该选项一起使用时。`upsert: true`
- [`db.collection.findOneAndUpdate()`](https://mongodb.net.cn/manual/reference/method/db.collection.findOneAndUpdate/#db.collection.findOneAndUpdate 'db.collection.findOneAndUpdate（）')与该选项一起使用时 。`upsert: true`
- [`db.collection.findOneAndReplace()`](https://mongodb.net.cn/manual/reference/method/db.collection.findOneAndReplace/#db.collection.findOneAndReplace 'db.collection.findOneAndReplace（）')与该选项一起使用时 。`upsert: true`
- [`db.collection.save()`](https://mongodb.net.cn/manual/reference/method/db.collection.save/#db.collection.save 'db.collection.save（）')
- [`db.collection.bulkWrite()`](https://mongodb.net.cn/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite 'db.collection.bulkWrite（）')

#### 查询

##### 投影查询

```js
// 过滤出 age > 18 的数据
const query = { age: { $gt: 18 } };

// 包含 { field1: value } 和 { field2: value }
const params = {
  field1: <value>,
  field2: <value>,
  ...
}

// limit(5) 查询前5条
db.collection.find(query, params).limit(5)

// 根据field1字段倒序后查前5条
db.collection
  .find(query, params)
  .sort({ $field1: -1 }})
  .limit(5)
```

该 `<value>`可以是任何如下：

- `1`或 `true`将该字段包括在退货单据中。
- `0`或 `false`排除该字段。
- 用[投影算子表示](https://mongodb.net.cn/manual/reference/operator/projection/)。
  [`find()`](https://mongodb.net.cn/manual/reference/method/db.collection.find/#db.collection.find 'db.collection.find（）')视图上的操作不支持以下[投影](https://mongodb.net.cn/manual/reference/operator/projection/) 运算符：
  - [`$`](https://mongodb.net.cn/manual/reference/operator/projection/positional/#proj._S_ '$')
  - [`$elemMatch`](https://mongodb.net.cn/manual/reference/operator/projection/elemMatch/#proj._S_elemMatch '$ elemMatch')
  - [`$slice`](https://mongodb.net.cn/manual/reference/operator/projection/slice/#proj._S_slice '$切片')
  - [`$meta`](https://mongodb.net.cn/manual/reference/operator/projection/meta/#proj._S_meta '$元')

#### 更新

##### 单条-更新运算符表达式文档更新

```js
db.collection.updateOne(
   <query>,
   { $set: { status: "D" }, $inc: { quantity: 2 } },
   ...
)
```

- `<query>`：一个文档，表示用于查找要更新文档的条件。只有符合这些条件的第一条文档会被更新。这里可以使用一些类似 `{ field: value }` 的表达式，表示查找指定字段等于指定值的文档。
- `{ $set: { status: "D" }, $inc: { quantity: 2 } }`：一个文档，表示需要将匹配到的文档中的哪些字段进行更新。这里使用了 `$set` 操作符来设置 `status` 字段的值为 `"D"`，同时使用了 `$inc` 操作符来增加 `quantity` 字段的值。

使用场景：对单条数据部分内容更新

##### 单条-聚合管道更新

```js
db.collection.updateOne(
   <query>,
   [
      {
        $set: {
          status: "Modified",
          comments: [ "$misc1", "$misc2" ]
        }
      },
      { $unset: [ "misc1", "misc2" ] }
   ]
   ...
)
```

- `<query>`：一个文档，表示用于查找要更新文档的条件。只有符合这些条件的第一条文档会被更新。这里可以使用一些类似 `{ field: value }` 的表达式，表示查找指定字段等于指定值的文档。
- `[{ $set: { status: "Modified", comments: [ "$misc1", "$misc2" ] } }, { $unset: [ "misc1", "misc2" ] }]` ：一个数组，表示需要对匹配到的文档进行的更新操作。这里的更新操作使用了 MongoDB 中的 aggregation pipeline，即通过一个管道来按顺序执行多个操作。在这个例子中，第一个操作对匹配到的文档设置 `status` 字段的值为 `"Modified"`，并创建一个名为 `comments` 的数组，其中包含两个字段：`$misc1` 和 `$misc2`。第二个操作将 `misc1` 和 `misc2` 字段从文档中删除。

使用场景：对单条数据部分内容的多个操作

##### 多条-更新运算符表达式文档更新

```js
db.collection.updateMany(
   <query>,
   { $set: { status: "D" }, $inc: { quantity: 2 } },
   ...
)
```

- `<query>`：一个文档，表示用于查找要更新文档的条件。符合这些条件的所有文档都会被更新。这里可以使用一些类似 `{ field: value }` 的表达式，表示查找指定字段等于指定值的文档。
- `{ $set: { status: "D" }, $inc: { quantity: 2 } }`：一个文档，表示需要将匹配到的文档中的哪些字段进行更新。这里使用了 `$set` 操作符来设置 `status` 字段的值为 `"D"`，同时使用了 `$inc` 操作符来增加 `quantity` 字段的值。

使用场景：批量更新

##### 多条-聚合管道更新

```js
db.collection.updateMany(
   <query>,
   [
      {
        $set: {
          status: "Modified",
          comments: [ "$misc1", "$misc2" ]
        }
      },
      { $unset: [ "misc1", "misc2" ] }
   ]
   ...
)
```

- `<query>`：一个文档，表示用于查找要更新文档的条件。符合这些条件的所有文档都会被更新。这里可以使用一些类似 `{ field: value }` 的表达式，表示查找指定字段等于指定值的文档。
- `[{ $set: { status: "Modified", comments: [ "$misc1", "$misc2" ] } }, { $unset: [ "misc1", "misc2" ] }]`：一个数组，表示需要对匹配到的所有文档进行的更新操作。这里的更新操作使用了 MongoDB 中的 aggregation pipeline，即通过一个管道来按顺序执行多个操作。在这个例子中，第一个操作对匹配到的所有文档设置 `status` 字段的值为 `"Modified"`，并创建一个名为 `comments` 的数组，其中包含两个字段：`$misc1` 和 `$misc2`。第二个操作将 `misc1` 和 `misc2` 字段从所有文档中删除。

使用场景：批量更新&&多个操作

##### 替换更新

```js
db.collection.replaceOne(
  { name: 'Central Perk Cafe' },
  { name: 'Central Pork Cafe', Borough: 'Manhattan' }
);
```

#### 删除

##### 单条

```js
db.orders.deleteOne({
  _id: ObjectId('563237a41a4d68582c2509da'),
});
```

##### 多条

```js
db.orders.deleteMany({
  stock: 'Brent Crude Futures',
  limit: { $gt: 48.88 },
});
```

### NodeJS 版

#### 安装 driver 依赖

```powershell
npm install mongodb --save
```

#### 启动 mongod 程序

```powershell
mongod --dbpath=/data
```

#### 连接数据库

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 连接 URL
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'myproject';

// 创建一个 MongoDB 客户端对象
const client = new MongoClient(url);

// 连接 MongoDB 服务器
client.connect(function (err) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  client.close();
});
```

#### 插入

```js
const insertDocuments = function (db, callback) {
  // 获取指定数据集合
  const collection = db.collection('documents');

  // 向集合中插入数据
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Inserted 3 documents into the collection');
    callback(result);
  });
};
```

#### 查询

回调函数（CRUD 均支持）

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 连接 URL
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'myproject';

const client = new MongoClient(url);

// 连接 MongoDB 服务器
client.connect(function (err) {
  assert.equal(null, err);
  console.log('Connected correctly to server');

  const db = client.db(dbName);

  insertDocuments(db, function () {
    findDocuments(db, function () {
      client.close();
    });
  });
});
```

- 查所有

  ```js
  const findDocuments = function (db, callback) {
    // 获取指定数据集合
    const collection = db.collection('documents');

    // 查所有
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log('Found the following records');
      console.log(docs);
      callback(docs);
    });
  };
  ```

- 根据字段查询

  ```js
  const findDocuments = function (db, callback) {
    // 获取指定数据集合
    const collection = db.collection('documents');

    // 查询字段 a 为 3 的数据
    collection.find({ a: 3 }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log('Found the following records');
      console.log(docs);
      callback(docs);
    });
  };
  ```

#### 更新

```js
const updateDocument = function (db, callback) {
  // 获取指定数据集合
  const collection = db.collection('documents');

  // 更新文档中 a 字段为 2 的记录，将其对应的 b 字段的值设为 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Updated the document with the field a equal to 2');
    callback(result);
  });
};
```

#### 删除

```js
const removeDocument = function (db, callback) {
  // 获取指定数据集合
  const collection = db.collection('documents');

  // 删除文档中 a 为 2 的记录
  collection.deleteOne({ a: 3 }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log('Removed the document with the field a equal to 3');
    callback(result);
  });
};
```

#### 给集合添加索引

##### 创建索引

```js
const indexCollection = function(db, callback) {
  // 获取指定数据集合
  const collection = db.collection('documents');

  // keys：需要创建索引的字段，1表示升序，-1降序
  const keys = { "a": 1 };

  // options：可选参数，用于控制索引的创建行为，例如 unique、sparse 等
  const options = null;

  // callback：可选参数，回调函数，用于处理执行结果。如果不传递该参数，则 createIndex 函数将返回一个 Promise 对象
  const callback = (err, results) {
    console.log(results);
    callback();
  }

  collection.createIndex(keys, options, callback);
};
```

##### 使用索引

```js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 连接 URL
const url = 'mongodb://localhost:27017';

// 数据库名
const dbName = 'myproject';

const client = new MongoClient(url);

// 连接 MongoDB 服务器
client.connect(function (err) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  insertDocuments(db, function () {
    indexCollection(db, function () {
      client.close();
    });
  });
});
```
