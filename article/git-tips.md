# git 学习笔记

- Git 中，HEAD 指向当前所在分支，分支指向最新的提交。上一个提交就是HEAD^，上上一个版本就是HEAD^^，往上100次提交写成HEAD~100。
- `git reflog` 用来记录每次对 HEAD 指向发生改变的操作
- `git add` 把要提交的所有修改放到暂存区（Stage），然后，`git commit`一次性把暂存区的所有修改提交到当前分支。
- Git管理的是修改
- `git checkout -- readme.txt`，把readme.txt在**工作区的修改**全部撤销，这里有两种情况：
    - 一种是 readme.txt 自修改后还没有被放到暂存区，撤销修改就回到和版本库当前提交一样的状态；
    - 一种是readme.txt已添加到暂存区后，又作了修改，撤销修改就回到**添加到暂存区后的状态**。
- 用 `git reset HEAD file` 可以把暂存区的修改撤销掉（unstage），重新放回工作区。然后使用 `git checkout` 来撤销文件在工作区的修改。
- git merge 用于将指定分支的提交合并到当前分支。
- git log --graph 以图表方式来查看分支合并的情况
- 合并分支时，加上`--no-ff` 就可以新增一个 commit。`git merge --no-ff -m "merge with no-ff" dev`
- `git stash`，可以把当前工作现场“储藏”起来，等以后恢复现场后继续工作。
- 如果要丢弃一个没有被合并过的分支，通过 `git branch -D name` 强行删除。
- `git checkout -b dev origin/dev`  创建远端分支到本地。
- 标签是版本库的快照，表明了在版本库中的某个时刻点的状态。其实它就是指向某个commit的指针，标签的 commit 指向不能像分支一样修改，readonly
- `git log --pretty=oneline --abbrev-commit`
- `git tag -m "version 0.1 released" v0.1`
- git 别名

    ```
    git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    ```
![git log --graph](http://ww2.sinaimg.cn/mw690/67157d58gw1eiqfniqenkj20eu0e2gnq.jpg)
![git reflog](http://ww3.sinaimg.cn/mw690/67157d58gw1eiqfni27o1j20g9056dh3.jpg)
![git branch](http://ww3.sinaimg.cn/mw690/67157d58gw1eiqfngsnjej20du03haab.jpg)
![版本库、工作区、暂存区、提交、分支、HEAD](http://ww2.sinaimg.cn/mw690/67157d58gw1eiqfniqenkj20eu0e2gnq.jpg)

