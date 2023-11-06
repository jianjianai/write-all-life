
export default interface DBUpdate {
    /**
     * 将修改更新到数据库
     */
    update: () => Promise<void>;
}
